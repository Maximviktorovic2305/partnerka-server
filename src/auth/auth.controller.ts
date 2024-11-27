import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetProfileDto, LoginAuthDto, RefreshTokenDto, RegisterAuthDto } from './dto/create-auth.dto';
import { CurrentUser } from './decorators/user.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 // Регистрация для Userа         
 @Post('register')  
 @UsePipes(new ValidationPipe())
 @HttpCode(200) 
 register(@Body() registerAuthDto: RegisterAuthDto) {
   return this.authService.register(registerAuthDto)
 }

  // Логин для Userа         
  @Post('login')  
  @UsePipes(new ValidationPipe())
  @HttpCode(200) 
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

  // Обновление токенов                 
  @Post('login/access-token')  
  @HttpCode(200) 
  getNewTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.getNewTokens(refreshTokenDto.refreshToken)
  }   

  // Получение своего профиля         
  @Get('me')   
  @Auth() 
  @HttpCode(200) 
  getProfile(@CurrentUser('id') userId: number) {
    return this.authService.getProfile(userId)
  }   

}
