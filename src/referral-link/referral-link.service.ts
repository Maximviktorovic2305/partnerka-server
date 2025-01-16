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
  async createLink(dto: CreateReferralLinkDto, userId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: dto.partnerId, userId },
    });
    if (!partner) throw new NotFoundException('Нет такого партнера');

    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateCreate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;
    const formatDateUpdate = dto.updatedFormatedDate
      ? formateDate(dto.updatedFormatedDate)
      : formattedDate;

    const generateRandomString = (length: number) => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';

      for (let i = 0; i < length; i++) {
        randomString += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      return randomString;
    };

    const randomString = generateRandomString(16);

    const referralLink = await this.prisma.referralLink.create({
      data: {
        createdFormatedDate: formatDateCreate,
        updatedFormatedDate: formatDateUpdate,
        partnerId: dto.partnerId,
        name: dto.name,
        hash: randomString,
        viewCount: dto.viewCount,
        viewUniqueCount: dto.viewUniqueCount,
        localeLinkPath: dto.localeLinkPath,
        serverLinkPath: dto.serverLinkPath,
        conversions: dto.conversions,
        amountToAwait: dto.amountToAwait,
        amountToPay: dto.amountToPay,
        offerId: dto.offerId,
        userId
      },
      select: { ...returnReferralLinkObject },
    });

    const offer = await this.prisma.offer.findUnique({where: {id: dto.offerId, userId}})
      if(!offer) {
        throw new NotFoundException('Нет такого offer')
      }

    const localeLinkPath = `${offer.domain}/?add=${referralLink.hash}`;
    const serverLinkPath = `http://85.143.216.62/:3533/?add=${referralLink.hash}`;

    const updatedRefferalLink = await this.prisma.referralLink.update({
      where: { id: referralLink.id, userId },
      data: {
        localeLinkPath,
        serverLinkPath,
      },
      include: { partner: true, offer: true },
    });

    return updatedRefferalLink;
  }

  // Получение ссылки по id
  async getLinkById(id: number, userId: number) {
    const referralLink = await this.prisma.referralLink.findUnique({
      where: { id, userId },
      select: { ...returnReferralLinkObject },
    });
    if (!referralLink) throw new NotFoundException('Нет такой ссылки');

    return referralLink;
  }   

  // Получение ссылки по hash
  async getLinkByHash(hash: string, userId: number) {
    const referralLink = await this.prisma.referralLink.findUnique({
      where: { hash, userId },
      select: { ...returnReferralLinkObject },
    });
    if (!referralLink) throw new NotFoundException('Нет такой ссылки');

    return referralLink;
  }

  // Получение всех ссылок по partnerId
  async getAllLinksByPartnerId(partnerId: number, userId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId, userId },
    });
    if (!partner) throw new NotFoundException('Нет такого партнера');

    const refferalLinks = await this.prisma.referralLink.findMany({
      where: { partnerId, userId },
      select: { ...returnReferralLinkObject },
    });

    return refferalLinks;
  }

  // Получение всех ссылок
  async getAllRefferalLinks(userId: number) {
    return this.prisma.referralLink.findMany({
      where: { userId },
      select: { ...returnReferralLinkObject },
    });
  }

  // Обновление ссылки по id
  async updateRefferalLinkById(dto: UpdateReferralLinkDto, userId: number) {
    const formattedDate = format(new Date(), 'dd.MM.yyyy');
    const formatDateUpdate = dto.createdFormatedDate
      ? formateDate(dto.createdFormatedDate)
      : formattedDate;

    const referralLink = await this.prisma.referralLink.update({
      where: { id: dto.id, userId },
      data: {
        ...dto
      },
      select: { ...returnReferralLinkObject },
    });

    return referralLink;
  }   

  // Удаление ссылки по id
  async deleteRefferalLink(id: number, userId: number) {
    await this.prisma.referralLink.delete({
      where: { id, userId },
    });

    return {
      message: 'Ссылка удалена',
    };
  }
}
