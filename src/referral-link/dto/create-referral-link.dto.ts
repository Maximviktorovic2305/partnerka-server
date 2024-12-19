import { IsOptional } from 'class-validator';

export class CreateReferralLinkDto {
  @IsOptional()
  partnerId: number;         

  @IsOptional()
  name: string;     

  @IsOptional()
  viewCount: number;  

  @IsOptional()
  viewUniqueCount: number;  

  @IsOptional()
  conversions: number
  
  @IsOptional()
  amountToAwait: number

  @IsOptional()
  amountToPay: number   
  
  @IsOptional()
  offerId: number

  @IsOptional()
  localeLinkPath: string

  @IsOptional()
  hash: string

  @IsOptional()
  serverLinkPath: string

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

export class GetRefferalLinkByHash {
  @IsOptional()
  hash: string; 
}