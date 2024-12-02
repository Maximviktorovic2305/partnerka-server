import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, DeleteLeadDto, GetLeadByIdDto, GetPartnersLeadsDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

 // Создать лид
 @Post()
 @Auth()
 @UsePipes(new ValidationPipe())
 create(@Body() createLeadDto: CreateLeadDto) {
   return this.leadService.create(createLeadDto);
 }

 // Получить лид по id
 @Post('leadId')
 @Auth()
 getLeadById(@Body() dto: GetLeadByIdDto) {
   return this.leadService.getLeadById(+dto.leadId);
 }

  // Получить лиды по id партнера
  @Post('partnerId')
  @Auth()
  getLeadsByPartnerId(@Body() dto: GetPartnersLeadsDto) {
    return this.leadService.getLeadsByPartnerId(+dto.partnerId);
  }

 // Получить все лиды
 @Get()
 @Auth()
 getAllLeads() {
   return this.leadService.getAllLeads();
 }

 // Обновить лид
 @Put('updateLead')
 @Auth()
 updateLead(
   @Body() updateLeadDto: UpdateLeadDto,
 ) {
   return this.leadService.updateLead(updateLeadDto);
 }

 // Удалить лид
 @Delete()
 @Auth()
 deleteLead(@Body() dto: DeleteLeadDto) {
   return this.leadService.deleteLead(+dto.leadId);
 }
}
