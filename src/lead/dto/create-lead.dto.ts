import { IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  createdFormatedDate: string;

  @IsOptional()
  updatedFormatedDate: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  sourse: string;

  @IsOptional()
  status: string;

  @IsOptional()
  offer: string;

  @IsOptional()
  amount: number;

  @IsOptional()
  partnerId: number;
}

export class GetLeadByIdDto {
  leadId: number;
}
export class GetPartnersLeadsDto {
  partnerId: number;
}
export class DeleteLeadDto {
  leadId: number;
}
