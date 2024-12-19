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

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // Создать оффер
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  createOffer(@Body() dto: CreateOfferDto) {
    return this.offersService.createOffer(dto);
  }

  // Получить оффер по id
  @Post('id')
  @Auth()
  getOfferById(@Body() dto: GetOfferByIddDto) {
    return this.offersService.getOfferById(dto.id);
  }

  // Получить все partners по id offer         
  @Post('offerId')
  @Auth()
  getAllPartnersByOfferId(@Body() dto: GetAllPartnersByOfferIdDto) {
    return this.offersService.getAllPartnersByOfferId(dto.offerId);
  }

  // Получить все offers
  @Get()
  @Auth()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  // // Обновить offer
  @Put()
  @Auth()
  updateOffer(@Body() dto: UpdateOfferDto) {
    return this.offersService.updateOffer(dto);
  }

  // // Удалить offer
  @Delete()
  @Auth()
  deleteOffer(@Body() dto: DeleteOfferDto) {
    return this.offersService.deleteOffer(dto.id);
  }
}
