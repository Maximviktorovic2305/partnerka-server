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
  offerId: number

  @IsOptional()
  registerDate: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  balance: number;

  @IsOptional()
  totalAwards: number;

  @IsOptional()
  @IsString()
  status: string;
}


  