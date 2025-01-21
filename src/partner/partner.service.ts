import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePartnerDto, GetPartnerByEmailDto } from './dto/create-partner.dto';
import { returnPartnerObject } from './return-partner.object';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { formateDate } from 'src/utils/formateDate';
import { format } from 'date-fns';         

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать партнера
  async create(dto: CreatePartnerDto, userId: number) {
    const partnerByEmail = await this.prisma.partner.findUnique({ where: { email: dto.email, userId } });
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
        userId
      },
      select: { ...returnPartnerObject },
    });

    return partner;
  }

  // Получить партнера по id
  async getPartnerById(id: number, userId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: id, userId },
      select: { ...returnPartnerObject },
    });

    if (!partner) throw new BadRequestException('Партнер не найден')

    return partner;
  }                

  // Получить партнера по email
  async getPartnerByEmail(email: string, userId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { email, userId },
      select: { ...returnPartnerObject },
    });

    if (!partner) throw new BadRequestException('Партнер не найден')

    return partner;
  }         

  // Получить партнера по email by admin           
  async getPartnerByEmailMyAdmin(dto: GetPartnerByEmailDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { email: dto.email, userId: dto.adminId },
      select: { ...returnPartnerObject },
    });

    if (!partner) throw new BadRequestException('Партнер не найден')

    return partner;
  }

  // Получить всех партнеров
  async getAllPartners(userId: number) {
    const partners = await this.prisma.partner.findMany({
      where: { userId },
      select: { ...returnPartnerObject },
    });

    return partners;
  }

  // Обновить партнера
  async updatePartner(dto: UpdatePartnerDto, userId: number) {

    const formattedDate = format(new Date(), 'dd.MM.yyyy')
    const formatDate = dto.registerDate ? formateDate(dto.registerDate) : formattedDate

    const partner = await this.getPartnerById(dto.id, userId);
    if (!partner) throw new BadRequestException('Партнер не найден')

    const partnerBalance = partner.withdraws.filter(item => item.isPaydOut === true).reduce((acc, item) => acc + item.amount, 0)
    const partnerBalanceToAwait = partner.withdraws.filter(item => item.isPaydOut === false).reduce((acc, item) => acc + item.amount, 0)
    const totalBalanse = partnerBalance + partnerBalanceToAwait

    const updatedPartner = await this.prisma.partner.update({
      where: { id: dto.id, userId },
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
  async deletePartner(partnerId: number, userId: number) {
    await this.prisma.partner.delete({
      where: { id: partnerId, userId },
    });

    return { message: 'Партнер удален' };
  }
}
