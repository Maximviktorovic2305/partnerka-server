import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { returnLeadObject } from './return-lead.object';
import { format } from 'date-fns';
import { formateDate } from 'src/utils/formateDate';
import { PartnerService } from 'src/partner/partner.service';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    private prisma: PrismaService,
    private partnerService: PartnerService,
  ) {}

  // Создать лид
  async create(dto: CreateLeadDto) {
    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateCreate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;
    const formatDateUpdate = dto.updatedFormatedDate
      ? formateDate(dto.updatedFormatedDate)
      : formattedDate;

    return this.prisma.lead.create({
      data: {
        createdFormatedDate: formatDateCreate,
        updatedFormatedDate: formatDateUpdate,
        name: dto.name,
        sourse: dto.sourse,
        status: dto.status,
        offer: dto.offer,
        amount: dto.amount,
        partnerId: dto.partnerId,
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

  // Получить лиды по id партнера с фильтрацией
async getLeadsByPartnerId(partnerId: number, filterType?: string, startDate?: Date, endDate?: Date) {
  const partner = await this.partnerService.getPartnerById(partnerId);
  if (!partner) {
    throw new NotFoundException('Партнер не найден!');
  }

  const today = new Date();
  let dateFilter: any;

  if (filterType) {
    switch (filterType) {
      case 'Сегодня':
        dateFilter = { 
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lt: new Date(today.setHours(23, 59, 59, 999)),
          },
        };
        break;

      case 'Вчера':
        const startOfYesterday = new Date(today);
        startOfYesterday.setDate(today.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date(today);
        endOfYesterday.setDate(today.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        dateFilter = {
          createdAt: {
            gte: startOfYesterday,
            lt: endOfYesterday,
          },
        };
        break;

      case '7 дней':
        const startOfLast7Days = new Date(today);
        startOfLast7Days.setDate(today.getDate() - 7);
        startOfLast7Days.setHours(0, 0, 0, 0);

        dateFilter = {
          createdAt: {
            gte: startOfLast7Days,
            lt: new Date(), 
          },
        };
        break;

      case '30 дней':
        const startOfLast30Days = new Date(today);
        startOfLast30Days.setDate(today.getDate() - 30);
        startOfLast30Days.setHours(0, 0, 0, 0);

        dateFilter = {
          createdAt: {
            gte: startOfLast30Days,
            lt: new Date(), 
          },
        };
        break;

      case 'Указать период':
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required for custom range.');
        }

        dateFilter = {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        };
        break;

      default:
        throw new Error('Invalid filter type.');
    }
  }

  const leads = await this.prisma.lead.findMany({
    where: { partnerId, ...dateFilter },
    select: { ...returnLeadObject },
  });

  const newLeads = leads.filter((lead) => lead.status === 'Новый').length;
  const inWorkLeads = leads.filter((lead) => lead.status === 'В работе').length;
  const dealLeads = leads.filter((lead) => lead.status === 'Сделка').length;
  const cancelLeads = leads.filter((lead) => lead.status === 'Отмена').length;

  return {
    leads,
    newLeads,
    inWorkLeads,
    dealLeads,
    cancelLeads,
  };
}


  // Получить все лиды
  async getAllLeads(filterType?: string, startDate?: Date, endDate?: Date) {
    const today = new Date();
    let dateFilter: any;

    if (filterType) {
      switch (filterType) {
        case 'Сегодня':
          dateFilter = {
            createdAt: {
              gte: new Date(today.setHours(0, 0, 0, 0)),
              lt: new Date(today.setHours(23, 59, 59, 999)),
            },
          };
          break;
  
        case 'Вчера':
          const startOfYesterday = new Date(today);
          startOfYesterday.setDate(today.getDate() - 1);
          startOfYesterday.setHours(0, 0, 0, 0);
  
          const endOfYesterday = new Date(today);
          endOfYesterday.setDate(today.getDate() - 1);
          endOfYesterday.setHours(23, 59, 59, 999);
  
          dateFilter = {
            createdAt: {
              gte: startOfYesterday,
              lt: endOfYesterday,
            },
          };
          break;
  
        case '7 дней':
          const startOfLast7Days = new Date(today);
          startOfLast7Days.setDate(today.getDate() - 7);
          startOfLast7Days.setHours(0, 0, 0, 0);
  
          dateFilter = {
            createdAt: {
              gte: startOfLast7Days,
              lt: new Date(), // До текущего момента
            },
          };
          break;
  
        case '30 дней':
          const startOfLast30Days = new Date(today);
          startOfLast30Days.setDate(today.getDate() - 30);
          startOfLast30Days.setHours(0, 0, 0, 0);
  
          dateFilter = {
            createdAt: {
              gte: startOfLast30Days,
              lt: new Date(), // До текущего момента
            },
          };
          break;
  
        case 'Указать период':
          if (!startDate || !endDate) {
            throw new Error('Start date and end date are required for custom range.');
          }
  
          dateFilter = {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          };
          break;
  
        default:
          throw new Error('Invalid filter type.');
      }
    } 

    const leads = await this.prisma.lead.findMany({
      where: dateFilter,
      select: { ...returnLeadObject },
    });

    const newLeads = leads.filter((lead) => lead.status === 'Новый').length;
    const inWorkLeads = leads.filter((lead) => lead.status === 'В работе').length;
    const dealLeads = leads.filter((lead) => lead.status === 'Сделка').length;
    const cancelLeads = leads.filter((lead) => lead.status === 'Отмена').length;

    return {
      leads,
      newLeads,
      inWorkLeads,
      dealLeads,
      cancelLeads,
    };
  }

  // Обновить лид
  async updateLead(dto: UpdateLeadDto) {
    const lead = await this.getLeadById(dto.id);
    if (!lead) {
      throw new BadRequestException('Лид не найден!');
    }

    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateUpdate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;

    return this.prisma.lead.update({
      where: { id: dto.id },
      data: {
        updatedFormatedDate: formatDateUpdate,
        name: dto.name,
        sourse: dto.sourse,
        status: dto.status,
        offer: dto.offer,
        amount: dto.amount,
        partnerId: dto.partnerId,
      },
      select: { ...returnLeadObject },
    });
  }

  // Удалить лид
  async deleteLead(leadId: number) {
    const lead = await this.getLeadById(leadId);
    if (!lead) {
      throw new BadRequestException('Лид не найден!');
    }

    await this.prisma.lead.delete({ where: { id: leadId } });

    return {
      message: 'Лид удален',
    };
  }
}
