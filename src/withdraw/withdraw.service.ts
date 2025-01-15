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
    const { createdFormatedDate, partnerId, partnerEmail, amount,leadName, comment } = dto
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
        leadName,
      },
      select: { ...returnWithdrawObject },
    });

    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
      include: {
        withdraws: true,
      }
    });
    if (!partner)
      throw new BadRequestException('Такого партнера не существует');

    // Обновляем выплаты для партнера         
    const partnerBalance = partner.withdraws.filter(item => item.isPaydOut === true).reduce((acc, item) => acc + item.amount, 0)
    const partnerBalanceToAwait = partner.withdraws.filter(item => item.isPaydOut === false).reduce((acc, item) => acc + item.amount, 0)
    const totalBalanse = partnerBalance + partnerBalanceToAwait   

    await this.prisma.partner.update({
      where: { id: partner.id },
      data: { balance: partnerBalance, balanceToAwait: partnerBalanceToAwait, totalAwards: totalBalanse },
      
    })

    return withdraw;
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
  
  // Получить все непроведенные выплаты выплаты
  async getAllIsNotPaydOutWithdraws() {
    const withdraws = await this.prisma.withdraw.findMany({
      where: { isPaydOut: false },
      select: { ...returnWithdrawObject },
    });

    return withdraws;
  }               

  // Получить все проведенные выплаты выплаты
  async getAllIsPaydOutWithdraws() {
    const withdraws = await this.prisma.withdraw.findMany({
      where: { isPaydOut: true },
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
      where: { partnerId: partner.id },
      select: { ...returnWithdrawObject },
    })         

    return withdraws
  }   

  // Обновить выплату
  async updateWithdraw(dto: UpdateWithdrawDto) {
    const {
      createdFormatedDate,
      partnerId,
      id,
      isPaydOut,
      amount,
      comment,
    } = dto;

    const withdraw = await this.prisma.withdraw.findUnique({ where: { id } });

    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const createdDate = createdFormatedDate
      ? formateDate(createdFormatedDate)
      : formattedDate;

    const updatedWithdraw = await this.prisma.withdraw.update({
      where: { id },
      data: {
        createdFormatedDate: createdFormatedDate === withdraw.createdFormatedDate ? withdraw.createdFormatedDate : createdDate,
        partnerId,
        comment,
        isPaydOut,
        amount,
      },
      select: { ...returnWithdrawObject },
    });

    const partner = await this.prisma.partner.findUnique({ where: { id: updatedWithdraw.partnerId }, include: { withdraws: true } });

    const partnerBalance = partner.withdraws.filter(item => item.isPaydOut === true).reduce((acc, item) => acc + item.amount, 0)
    const partnerBalanceToAwait = partner.withdraws.filter(item => item.isPaydOut === false).reduce((acc, item) => acc + item.amount, 0)
    const totalBalanse = partnerBalance + partnerBalanceToAwait   

    await this.prisma.partner.update({
      where: { id: partner.id },
      data: { balance: partnerBalance, balanceToAwait: partnerBalanceToAwait, totalAwards: totalBalanse },
    })

    return updatedWithdraw;
  }         

  // Обновить множество выплат, установив isPaydOut на true
  async updateManyWithdrawsToPaydOut(dtos: UpdateWithdrawDto[]) {
    const updatedWithdraws = [];

    for (const dto of dtos) {
      const { id } = dto;

      const withdraw = await this.prisma.withdraw.findUnique({ where: { id } });
      if (!withdraw) {
        throw new BadRequestException(`Выплата с id ${id} не найдена`);
      }

      const updatedWithdraw = await this.prisma.withdraw.update({
        where: { id },
        data: {
          isPaydOut: true,
        },
        select: { ...returnWithdrawObject },
      });

      const partner = await this.prisma.partner.findUnique({ where: { id: updatedWithdraw.partnerId }, include: { withdraws: true } });

      const partnerBalance = partner.withdraws.filter(item => item.isPaydOut === true).reduce((acc, item) => acc + item.amount, 0);
      const partnerBalanceToAwait = partner.withdraws.filter(item => item.isPaydOut === false).reduce((acc, item) => acc + item.amount, 0);
      const totalBalanse = partnerBalance + partnerBalanceToAwait;

      await this.prisma.partner.update({
        where: { id: partner.id },
        data: { balance: partnerBalance, balanceToAwait: partnerBalanceToAwait, totalAwards: totalBalanse },
      });

      updatedWithdraws.push(updatedWithdraw);
    }

    return updatedWithdraws;
  }

  // Удалить выплату
  async deleteWithdraw(withdrawId: number) {
    await this.prisma.withdraw.delete({
      where: { id: withdrawId },
    });

    return { message: 'Выплата удалена' };
  }
}
