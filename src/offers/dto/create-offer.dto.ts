import { IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsOptional()
  name: string;

  @IsOptional()
  domain: string

  @IsOptional()
  conversions: number        

  @IsOptional()
  amount: number         

  @IsOptional()
  status: string

  @IsOptional()
  partnersCount: number

}

export class GetOffersByPartnerIdDto {
  @IsOptional()
  partnerId: number;

}

export class GetOfferByIddDto {
  @IsOptional()
  id: number;

}

export class DeleteOfferDto {
  @IsOptional()
  id: number;

}

export class GetAllPartnersByOfferIdDto {
  @IsOptional()
  offerId: number;

}


  