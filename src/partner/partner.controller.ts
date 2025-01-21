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
import { CreatePartnerDto, GetPartnerByEmailDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Создать партнера
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  create(@Body() createPartnerDto: CreatePartnerDto, @CurrentUser('id') userId: number) {
    return this.partnerService.create(createPartnerDto, userId);
  }

  // Получить партнера по id
  @Get(':id')
  @Auth()
  getPartnerById(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.partnerService.getPartnerById(+id, userId);
  }         

  // Получить партнера по email
  @Post('email')
  @UsePipes(new ValidationPipe())
  @Auth()
  getPartnerByEmail(@Body() dto: GetPartnerByEmailDto, @CurrentUser('id') userId: number) {
    return this.partnerService.getPartnerByEmail(dto.email, userId);
  }                   

  // Получить партнера по emailMyAdmin
  @Post('emailMyAdmin')
  @UsePipes(new ValidationPipe())
  @Auth()
  getPartnerByEmailMyAdmin(@Body() dto: GetPartnerByEmailDto) {
    return this.partnerService.getPartnerByEmailMyAdmin(dto);
  }

  // Получить всех партнеров
  @Get()
  @Auth()
  getAllPartners(@CurrentUser('id') userId: number) {
    return this.partnerService.getAllPartners(userId);
  }

  // Обновить партнера
  @Put()
  @Auth()
  upfdatePartner(
    @Body() updatePartnerDto: UpdatePartnerDto,
    @CurrentUser('id') userId: number
  ) {
    return this.partnerService.updatePartner(updatePartnerDto, userId);
  }

  // Удалить партнера
  @Delete(':id')
  @Auth()
  deletePartner(@Param('id') partnerId: number, @CurrentUser('id') userId: number) {
    return this.partnerService.deletePartner(+partnerId, userId);
  }
}
