import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение userа по id
  @Get('id')
  @UsePipes(new ValidationPipe())
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

  // Обновить пользователя
  @Put()
  // @UsePipes(new ValidationPipe())
  @Auth()
  updateUser(@CurrentUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  // Удаление пользователя администратором
  @Delete()
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  deleteUser(@Body() dto: DeleteUserDto) {
    return this.userService.deleteUser(+dto.userId);
  }
}
