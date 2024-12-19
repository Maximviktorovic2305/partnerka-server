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
      },
      select: { ...returnReferralLinkObject },
    });

    const offer = await this.prisma.offer.findUnique({where: {id: dto.offerId}})
      if(!offer) {
        throw new NotFoundException('Нет такого offer')
      }

    const localeLinkPath = `${offer.domain}/?reff=${referralLink.hash}`;
    const serverLinkPath = `http://85.143.216.62/:3533/?reff=${referralLink.hash}`;

    const updatedRefferalLink = await this.prisma.referralLink.update({
      where: { id: referralLink.id },
      data: {
        localeLinkPath,
        serverLinkPath,
      },
      include: { partner: true, offer: true },
    });

    return updatedRefferalLink;
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

  // Получение ссылки по hash
  async getLinkByHash(hash: string) {
    const referralLink = await this.prisma.referralLink.findUnique({
      where: { hash },
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

    const referralLink = await this.prisma.referralLink.update({
      where: { id: dto.id },
      data: {
        ...dto
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
    };
  }
}
