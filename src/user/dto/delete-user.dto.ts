import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsNumber()
  userId: number;
}
