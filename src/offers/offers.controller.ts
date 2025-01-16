import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, DeleteOfferDto, GetAllPartnersByOfferIdDto, GetOfferByIddDto, GetOffersByPartnerIdDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // Создать оффер
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  createOffer(@Body() dto: CreateOfferDto, @CurrentUser('id') userId: number) {
    return this.offersService.createOffer(dto, userId);
  }

  // Получить оффер по id
  @Post('id')
  @Auth()
  getOfferById(@Body() dto: GetOfferByIddDto, @CurrentUser('id') userId: number) {
    return this.offersService.getOfferById(dto.id,userId);
  }

  // Получить все partners по id offer         
  @Post('offerId')
  @Auth()
  getAllPartnersByOfferId(@Body() dto: GetAllPartnersByOfferIdDto, @CurrentUser('id') userId: number) {
    return this.offersService.getAllPartnersByOfferId(dto.offerId, userId);
  }

  // Получить все offers
  @Get()
  @Auth()
  getAllOffers(@CurrentUser('id') userId: number) {
    return this.offersService.getAllOffers(userId);
  }

  // // Обновить offer
  @Put()
  @Auth()
  updateOffer(@Body() dto: UpdateOfferDto, @CurrentUser('id') userId: number) {
    return this.offersService.updateOffer(dto, userId);
  }

  // // Удалить offer
  @Delete()
  @Auth()
  deleteOffer(@Body() dto: DeleteOfferDto, @CurrentUser('id') userId: number) {
    return this.offersService.deleteOffer(dto.id, userId);
  }
}
