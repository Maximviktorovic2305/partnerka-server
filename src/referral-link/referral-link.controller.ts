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
import { ReferralLinkService } from './referral-link.service';
import {
  CreateReferralLinkDto,
  DeleteRefferalLinkDto,
  GetPartnerRefferalLinksByPartnerIdDto,
  GetRefferalLinkByHash,
  GetRefferalLinkByIdDto,
} from './dto/create-referral-link.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateReferralLinkDto } from './dto/update-referral-link.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('referral-links')
export class ReferralLinkController {
  constructor(private readonly referralLinkService: ReferralLinkService) {}

  // Создание ссылки
  @Post()
  @UsePipes(new ValidationPipe())
  @Auth()
  createLink(@Body() dto: CreateReferralLinkDto, @CurrentUser('id') userId: number) {
    return this.referralLinkService.createLink(dto, userId);
  }

  // Получение ссылки по id
  @Post('id')
  @Auth()
  getLinkById(@Body() dto: GetRefferalLinkByIdDto, @CurrentUser('id') userId: number) {
    return this.referralLinkService.getLinkById(dto.id, userId);
  }         

  // Получение ссылки по hash
  @Post('hash')
  @Auth()
  getLinkByHash(@Body() dto: GetRefferalLinkByHash, @CurrentUser('id') userId: number) {
    return this.referralLinkService.getLinkByHash(dto.hash, userId);
  }

  // Получение всех ссылок по partnerId
  @Post('partnerId')
  @Auth()
  getAllLinksByPartnerId(@Body() dto: GetPartnerRefferalLinksByPartnerIdDto, @CurrentUser('id') userId: number) {
    return this.referralLinkService.getAllLinksByPartnerId(dto.partnerId, userId);
  }

  // Получение всех ссылок
  @Get()
  @Auth()
  getAllRefferalLinks(@CurrentUser('id') userId: number) {
    return this.referralLinkService.getAllRefferalLinks(userId);
  }

  // Обновление ссылки по id
  @Put()
  @Auth()
  updateRefferalLinkById(@Body() dto: UpdateReferralLinkDto, @CurrentUser('id') userId: number) {
    return this.referralLinkService.updateRefferalLinkById(dto, userId);
  }         

  // Удаление ссылки по id
  @Delete()
  @Auth()
  deleteRefferalLink(@Body() dto: DeleteRefferalLinkDto, @CurrentUser('id') userId: number) {
    return this.referralLinkService.deleteRefferalLink(dto.id, userId);
  }
}
