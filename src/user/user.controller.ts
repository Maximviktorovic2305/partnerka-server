import {
  Body,
  Controller,
  Delete,
  Get,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение userа по id
  @Get('id')
  @Auth()
  getByUserId(@Body() dto: GetUserByIdDto) {
    return this.userService.getByUserId(dto.userId);
  }

  // Получение всех пользователей администратором
  @Get('/all')
  @Auth('admin')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Удаление пользователя администратором
  @Delete()
  @Auth('admin')
  deleteUser(@Body() dto: DeleteUserDto) {
    return this.userService.deleteUser(dto.userId);
  }
}
