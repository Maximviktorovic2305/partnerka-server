import { PartnerStatusEnum } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  registerDate: string;

  @IsOptional()
  @IsString()
  status: PartnerStatusEnum;
}


  