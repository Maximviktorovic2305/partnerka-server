import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { format } from 'date-fns';
import { formateDate } from 'src/utils/formateDate';
import { returnWithdrawObject } from './return-withdraw.object';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Injectable()
export class WithdrawService {
  constructor(private prisma: PrismaService) {}

  // Создать выплату
  async create(dto: CreateWithdrawDto) {
    const { createdFormatedDate, partnerId, partnerEmail, amount, comment } =
      dto
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });
    if (!partner)
      throw new BadRequestException('Такого партнера не существует');

    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const createdDate = createdFormatedDate
      ? formateDate(createdFormatedDate)
      : formattedDate;

    const withdraw = await this.prisma.withdraw.create({
      data: {
        createdFormatedDate: createdDate,
        partnerId,
        partnerEmail,
        comment,
        amount,
      },
      select: { ...returnWithdrawObject },
    });

    return partner;
  }

  // Получить выплату по id
  async getWithdrawById(withdrawId: number) {
    const withdraw = await this.prisma.withdraw.findUnique({
      where: { id: withdrawId },
      select: { ...returnWithdrawObject },
    });

    if (!withdraw) throw new BadRequestException('Выплата не найдена');

    return withdraw;
  }

  // Получить все выплаты
  async getAllWithdraws() {
    const withdraws = await this.prisma.withdraw.findMany({
      select: { ...returnWithdrawObject },
    });

    return withdraws;
  }         

  // Получить все выплаты партнера         
  async getAllPartnerWithdraws(partnerId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });
    if (!partner)
      throw new BadRequestException('Такого партнера не существует');

    const withdraws = await this.prisma.withdraw.findMany({
      where: { partnerId },
      select: { ...returnWithdrawObject },
    })         

    return withdraws
  }

  // Обновить выплату
  async updateWithdraw(dto: UpdateWithdrawDto) {
    const {
      createdFormatedDate,
      partnerId,
      partnerEmail,
      id,
      amount,
      comment,
    } = dto;
    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const createdDate = createdFormatedDate
      ? formateDate(createdFormatedDate)
      : formattedDate;

    const withdraw = await this.prisma.withdraw.update({
      where: { id },
      data: {
        createdFormatedDate: createdDate,
        partnerId,
        partnerEmail,
        comment,
        amount,
      },
      select: { ...returnWithdrawObject },
    });

    return withdraw;
  }

  // Удалить выплату
  async deleteWithdraw(withdrawId: number) {
    await this.prisma.withdraw.delete({
      where: { id: withdrawId },
    });

    return { message: 'Выплата удалена' };
  }
}
