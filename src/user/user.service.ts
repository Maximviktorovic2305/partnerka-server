import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { returnUserObject } from './return-user.object';
import { RegisterAuthDto } from 'src/auth/dto/create-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Получение профиля пользователем по id
  async getByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        ...returnUserObject,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  // Получение userа по id
  async byId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUserObject,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  // Создание пользователя
  async create(dto: RegisterAuthDto) {
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        lastname: dto.lastname,
        email: dto.email,
        password: await argon2.hash(dto.password),
      },
      select: { ...returnUserObject },
    });

    return user;
  }                     

  // Обновление пользователя         
  async updateUser(userId: number, dto: UpdateUserDto) {
    const { email, isAdmin, lastname, name, password } = dto

    const user = await this.prisma.user.update({
      where: { id: userId }, 
      data: {
        email,
        isAdmin,
        lastname,
        name,
        password: password && await argon2.hash(password),
      },
      select: { ...returnUserObject },
    });

    return user;
  }

  // Получение всех пользователей администратором
  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // Удаление пользователя администратором
  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Пользователь удален',
    };
  }
}
