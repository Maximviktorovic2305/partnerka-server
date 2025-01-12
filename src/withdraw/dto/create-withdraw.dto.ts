import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @IsOptional()
  createdFormatedDate: string;

  @IsOptional()
  partnerId: number;

  @IsOptional()
  @IsString()
  partnerEmail: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  isPaydOut: boolean

  @IsOptional()
  @IsNumber()
  amount: number;
}

export class GetByIdWithdrawDto {
  withdrawId: number
}                     

export class GetPartnerWithdrawDto {
  partnerId: number
}                     

export class DeleteWithDrawDto {
  withdrawId: number
}