import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { returnLeadObject } from './return-lead.object';
import { format } from 'date-fns';
import { formateDate } from 'src/utils/formateDate';
import { PartnerService } from 'src/partner/partner.service';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService, private partnerService: PartnerService) {}   
  
  // Создать лид
  async create(dto: CreateLeadDto) {
    const formattedDate = format(new Date(), 'dd.MM.yyyy')
    const formatDateCreate = dto.createdFormatedDate ? formateDate(dto.createdFormatedDate) : formattedDate
    const formatDateUpdate = dto.updatedFormatedDate ? formateDate(dto.updatedFormatedDate) : formattedDate

    return this.prisma.lead.create({
      data: {
        createdFormatedDate: formatDateCreate,
        updatedFormatedDate: formatDateUpdate,
        name: dto.name,
        sourse: dto.sourse,
        status: dto.status,
        offer: dto.offer,
        amount: dto.amount,
        partnerId: dto.partnerId
      },           
      select: { ...returnLeadObject },
    });

  }         

  // Получить лид по id
  async getLeadById(leadId: number) {
    return this.prisma.lead.findUnique({
      where: { id: leadId },
      select: { ...returnLeadObject },
    });
  }         

  // Получить лиды по id партнера
  async getLeadsByPartnerId(partnerId: number) {
    const partner = await this.partnerService.getPartnerById(partnerId);
    if(!partner) {
      throw new NotFoundException('Партнер не найден!');
    }

    const leads = await this.prisma.lead.findMany({ where: { partnerId } });   

    const newLeads = leads.filter(lead => lead.status === 'New').length
    const inWorkLeads = leads.filter(lead => lead.status === 'InWork').length
    const dealLeads = leads.filter(lead => lead.status === 'Deal').length
    const cancelLeads = leads.filter(lead => lead.status === 'Cancel').length         

    return {
      leads,
      newLeads,
      inWorkLeads,
      dealLeads,
      cancelLeads         
    }
  }   

  // Получить все лиды         
  async getAllLeads() {
    const leads = await this.prisma.lead.findMany({
      select: { ...returnLeadObject },
    })         

    const newLeads = leads.filter(lead => lead.status === 'New').length
    const inWorkLeads = leads.filter(lead => lead.status === 'InWork').length
    const dealLeads = leads.filter(lead => lead.status === 'Deal').length
    const cancelLeads = leads.filter(lead => lead.status === 'Cancel').length

    return {
      leads,
      newLeads,
      inWorkLeads,
      dealLeads,
      cancelLeads         
    }
  }   

  // Обновить лид
  async updateLead(dto: UpdateLeadDto) {
    const lead = await this.getLeadById(dto.id);
    if(!lead) {
      throw new BadRequestException('Лид не найден!');
    }

    const formattedDate = format(new Date(), 'dd.MM.yyyy')
    const formatDateUpdate = dto.createdFormatedDate ? formateDate(dto.createdFormatedDate) : formattedDate

    return this.prisma.lead.update({
      where: { id: dto.id },
      data: {
        updatedFormatedDate: formatDateUpdate,
        name: dto.name,
        sourse: dto.sourse,
        status: dto.status,
        offer: dto.offer,
        amount: dto.amount,
        partnerId: dto.partnerId
      },
      select: { ...returnLeadObject },
    });

  }         

  // Удалить лид
  async deleteLead(leadId: number) {
    const lead = await this.getLeadById(leadId);
    if(!lead) {
      throw new BadRequestException('Лид не найден!');
    }   

    await this.prisma.lead.delete({where: { id: leadId } });   

    return {
      message: 'Лид удален'
    }
  }
}
