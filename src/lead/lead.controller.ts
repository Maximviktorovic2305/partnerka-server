import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, DeleteLeadDto, GetAllLeadsDto, GetLeadByIdDto, GetPartnersLeadsDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

 // Создать лид
 @Post()
 @Auth()
 @UsePipes(new ValidationPipe())
 create(@CurrentUser('id') userId: number, @Body() createLeadDto: CreateLeadDto) {
   return this.leadService.create(userId, createLeadDto);
 }

 // Получить лид по id
 @Post('leadId')
 @Auth()
 getLeadById(@CurrentUser('id') userId: number, @Body() dto: GetLeadByIdDto) {
   return this.leadService.getLeadById(userId, +dto.leadId);
 }

  // Получить лиды по id партнера
  @Post('partnerId')
  @Auth()
  getLeadsByPartnerId(@CurrentUser('id') userId: number, @Body() dto: GetPartnersLeadsDto) {
    return this.leadService.getLeadsByPartnerId(userId, +dto.partnerId, dto.filterType, dto.startDate, dto.endDate);
  }

 // Получить все лиды
 @Post('allLeads')
 @Auth()
 getAllLeads(@CurrentUser('id') userId: number, @Body() dto: GetAllLeadsDto) {
   return this.leadService.getAllLeads(userId, dto.filterType, dto.startDate, dto.endDate);
 }

 // Обновить лид
 @Put('updateLead')
 @Auth()
 updateLead(
   @Body() updateLeadDto: UpdateLeadDto,
   @CurrentUser('id') userId: number
 ) {
   return this.leadService.updateLead(updateLeadDto, userId,);
 }

 // Удалить лид
 @Delete()
 @Auth()
 deleteLead(@CurrentUser('id') userId: number, @Body() dto: DeleteLeadDto) {
   return this.leadService.deleteLead(userId, +dto.leadId);
 }
}
