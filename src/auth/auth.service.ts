import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  // Генерируем токены         
  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  // Возвращаемые поля пользователя         
  private returnUserFields(user: User) {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  // Проверяем пароль пользователя   
  private async validateUser(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await argon2.verify(user.password, loginAuthDto.password);

    if (!isValid) throw new NotFoundException('Не верный пароль');

    return user;
  }

  // Зарегистрировать пользователя 
  async register(registerAuthDto: RegisterAuthDto) {  
    const isUserExists = await this.prisma.user.findUnique({where: { email: registerAuthDto.email } });
    if (isUserExists) throw new BadRequestException('Пользователь с таким email уже существует');         
    
    const user = await this.userService.create(registerAuthDto);

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };

  }

  // Логин пользователя         
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.validateUser(loginAuthDto);

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  // Получить свой профайл
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  // Получить новые токены
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!refreshToken) throw new UnauthorizedException('Ошибка токена');

    const user = await this.userService.byId(result.id);

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
}
