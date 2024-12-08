import { IsOptional } from 'class-validator';

export class CreateReferralLinkDto {
  @IsOptional()
  partnerId: number;         

  @IsOptional()
  name: string;         

  @IsOptional()
  devicesId: string;

  @IsOptional()
  createdFormatedDate: string

  @IsOptional()
  updatedFormatedDate: string
}

export class GetRefferalLinkByIdDto {
  @IsOptional()
  id: number;  
}   

export class GetPartnerRefferalLinksByPartnerIdDto {
  @IsOptional()
  partnerId: number;  
}         

export class DeleteRefferalLinkDto {
  @IsOptional()
  id: number; 
}