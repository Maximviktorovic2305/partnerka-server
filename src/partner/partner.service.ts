import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { returnPartnerObject } from './return-partner.object';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { formateDate } from 'src/utils/formateDate';
import { format } from 'date-fns';         

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать партнера
  async create(dto: CreatePartnerDto) {
    const partnerByEmail = await this.prisma.partner.findUnique({ where: { email: dto.email } });
    if (partnerByEmail) throw new BadRequestException('Партнер с таким email уже существует')

    const formattedDate = format(new Date(), 'dd.MM.yyyy')
    const formatDate = dto.registerDate ? formateDate(dto.registerDate) : formattedDate         
  
    const partner = await this.prisma.partner.create({
      data: {
        email: dto.email,
        name: dto.name,
        lastname: dto.lastname,
        phone: dto.phone,
        balance: dto.balance,
        balanceToAwait: dto.balanceToAwait,
        totalAwards: dto.totalAwards,
        status: dto.status,
        registerDate: formatDate,
      },
      select: { ...returnPartnerObject },
    });

    return partner;
  }

  // Получить партнера по id
  async getPartnerById(partnerId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      select: { ...returnPartnerObject },
    });

    if (!partner) throw new BadRequestException('Партнер не найден')

    return partner;
  }

  // Получить всех партнеров
  async getAllPartners() {
    const partners = await this.prisma.partner.findMany({
      select: { ...returnPartnerObject },
    });

    return partners;
  }

  // Обновить партнера
  async updatePartner(dto: UpdatePartnerDto) {

    const formattedDate = format(new Date(), 'dd.MM.yyyy')
    const formatDate = dto.registerDate ? formateDate(dto.registerDate) : formattedDate

    const partner = await this.getPartnerById(dto.id);
    if (!partner) throw new BadRequestException('Партнер не найден')

    const partnerBalance = partner.withdraws.filter(item => item.isPaydOut === true).reduce((acc, item) => acc + item.amount, 0)
    const partnerBalanceToAwait = partner.withdraws.filter(item => item.isPaydOut === false).reduce((acc, item) => acc + item.amount, 0)
    const totalBalanse = partnerBalance + partnerBalanceToAwait

    const updatedPartner = await this.prisma.partner.update({
      where: { id: dto.id },
      data: { email: dto.email,
        name: dto.name,
        lastname: dto.lastname,
        phone: dto.phone,
        balance: partnerBalance,
        balanceToAwait: partnerBalanceToAwait,
        totalAwards: totalBalanse,
        status: dto.status,
        registerDate: formatDate, },
      select: { ...returnPartnerObject },
    });

    return updatedPartner;
  }

  // Удалить партнера
  async deletePartner(partnerId: number) {
    await this.prisma.partner.delete({
      where: { id: partnerId },
    });

    return { message: 'Партнер удален' };
  }
}
