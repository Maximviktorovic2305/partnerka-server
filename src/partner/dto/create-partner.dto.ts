import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  balanceToAwait: number;

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

export class GetPartnerByEmailDto {
  @IsString()
  email: string;

  @IsNumber()
  adminId: number;
}