import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Создать партнера
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  // Получить партнера по id
  @Get(':id')
  @Auth()
  getPartnerById(@Param('id') partnerId: number) {
    return this.partnerService.getPartnerById(+partnerId);
  }

  // Получить всез партнеров
  @Get()
  @Auth()
  getAllPartners() {
    return this.partnerService.getAllPartners();
  }

  // Обновить партнера
  @Put()
  @Auth()
  upfdatePartner(
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.updatePartner(updatePartnerDto);
  }

  // Удалить партнера
  @Delete(':id')
  @Auth()
  deletePartner(@Param('id') partnerId: number) {
    return this.partnerService.deletePartner(+partnerId);
  }
}
