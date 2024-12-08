import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnReferralLinkObject } from './return-refferal-link.object';
import { format } from 'date-fns';
import { formateDate } from 'src/utils/formateDate';
import { CreateReferralLinkDto } from './dto/create-referral-link.dto';
import { UpdateReferralLinkDto } from './dto/update-referral-link.dto';

@Injectable()
export class ReferralLinkService {
  constructor(private prisma: PrismaService) {}

  // Создание ссылки
  async createLink(dto: CreateReferralLinkDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: dto.partnerId },
    });
    if (!partner) throw new NotFoundException('Нет такого партнера');

    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateCreate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;
    const formatDateUpdate = dto.updatedFormatedDate
      ? formateDate(dto.updatedFormatedDate)
      : formattedDate;

    const referralLink = await this.prisma.referralLink.create({
      data: {
        createdFormatedDate: formatDateCreate,
        updatedFormatedDate: formatDateUpdate,
        partnerId: dto.partnerId,
      },
      select: { ...returnReferralLinkObject },
    });

    return referralLink;
  }

  // Получение ссылки по id
  async getLinkById(id: number) {
    const referralLink = await this.prisma.referralLink.findUnique({
      where: { id },
      select: { ...returnReferralLinkObject },
    });
    if (!referralLink) throw new NotFoundException('Нет такой ссылки');

    return referralLink;
  }

  // Получение всех ссылок по partnerId
  async getAllLinksByPartnerId(partnerId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });
    if (!partner) throw new NotFoundException('Нет такого партнера');

    const refferalLinks = await this.prisma.referralLink.findMany({
      where: { partnerId },
      select: { ...returnReferralLinkObject },
    });

    return refferalLinks;
  }

  // Получение всех ссылок
  async getAllRefferalLinks() {
    return this.prisma.referralLink.findMany({
      select: { ...returnReferralLinkObject },
    });
  }

  // Обновление ссылки по id
  async updateRefferalLinkById(dto: UpdateReferralLinkDto) {
    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateUpdate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;

    // Получаем текущий массив devicesId из базы данных
    const currentReferralLink = await this.prisma.referralLink.findUnique({
      where: { id: dto.id },
      select: { devicesId: true },
    });

    const currentDevicesId = currentReferralLink?.devicesId || [];

    if (currentDevicesId.includes(dto.devicesId))
      throw new BadRequestException(
        'Пользователь уже был зарегистирован с данного устройства',
      );

    const referralLink = await this.prisma.referralLink.update({
      where: { id: dto.id },
      data: {
        updatedFormatedDate: formatDateUpdate,
        partnerId: dto.partnerId,
        name: dto.name,
        devicesId: [...currentDevicesId, dto.devicesId], // Добавляем новое значение
      },
      select: { ...returnReferralLinkObject },
    });

    return referralLink;
  }         

  // Удаление ссылки по id
  async deleteRefferalLink(id: number) {
    await this.prisma.referralLink.delete({
      where: { id },
    });

    return {
      message: 'Ссылка удалена',
    }

  }
}
