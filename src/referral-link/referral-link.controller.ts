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

@Controller('referral-links')
export class ReferralLinkController {
  constructor(private readonly referralLinkService: ReferralLinkService) {}

  // Создание ссылки
  @Post()
  @UsePipes(new ValidationPipe())
  @Auth()
  createLink(@Body() dto: CreateReferralLinkDto) {
    return this.referralLinkService.createLink(dto);
  }

  // Получение ссылки по id
  @Post('id')
  @Auth()
  getLinkById(@Body() dto: GetRefferalLinkByIdDto) {
    return this.referralLinkService.getLinkById(dto.id);
  }         

  // Получение ссылки по hash
  @Post('hash')
  @Auth()
  getLinkByHash(@Body() dto: GetRefferalLinkByHash) {
    return this.referralLinkService.getLinkByHash(dto.hash);
  }

  // Получение всех ссылок по partnerId
  @Post('partnerId')
  @Auth()
  getAllLinksByPartnerId(@Body() dto: GetPartnerRefferalLinksByPartnerIdDto) {
    return this.referralLinkService.getAllLinksByPartnerId(dto.partnerId);
  }

  // Получение всех ссылок
  @Get()
  @Auth()
  getAllRefferalLinks() {
    return this.referralLinkService.getAllRefferalLinks();
  }

  // Обновление ссылки по id
  @Put()
  @Auth()
  updateRefferalLinkById(@Body() dto: UpdateReferralLinkDto) {
    return this.referralLinkService.updateRefferalLinkById(dto);
  }         

  // Удаление ссылки по id
  @Delete()
  @Auth()
  deleteRefferalLink(@Body() dto: DeleteRefferalLinkDto) {
    return this.referralLinkService.deleteRefferalLink(dto.id);
  }
}
