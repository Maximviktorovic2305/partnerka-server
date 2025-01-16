import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PrismaService } from 'src/prisma.service';
import { returnOfferObject } from './return-offer.object';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание offer
  async createOffer(dto: CreateOfferDto, userId: number) {
    const offer = await this.prisma.offer.create({
      data: {
        name: dto.name,
        domain: dto.domain ? dto.domain : 'http://localhost:3533',
        conversions: dto.conversions,
        amount: dto.amount,
        status: dto.status,
        userId
      },
      select: { ...returnOfferObject },
    });

    return offer;
  }

  // Получение offer по id
  async getOfferById(id: number, userId: number) {
    const offer = await this.prisma.offer.findUnique({
      where: { id, userId },
      select: { ...returnOfferObject },
    });
    if (!offer) throw new NotFoundException('Нет такого offer');

    const partnersCount = await this.getAllPartnersByOfferId(offer.id, userId);

    const updatedOffer = await this.prisma.offer.update({
      where: { id: offer.id, userId },
      data: {
        partnersCount: partnersCount,
      }
    })

    return updatedOffer;
  }

  // // Получение всех offers
  async getAllOffers(userId: number) {
    return this.prisma.offer.findMany({
      where: { userId },
      select: { ...returnOfferObject },
    });
  }

  // // Получение всех партнеров по offerId
  async getAllPartnersByOfferId(offerId: number, userId: number) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId, userId },
      include: {
        refferalLinks: true,
      },
    });

    // Получаем уникальные partnerId
    const uniquePartnerIds = new Set();

    if (offer && offer.refferalLinks) {
      offer.refferalLinks.forEach((link) => {
        if (link.partnerId) {
          uniquePartnerIds.add(link.partnerId);
        }
      });
    }

    // Количество уникальных partnerId
    const uniqueCount = uniquePartnerIds.size;

    return uniqueCount
  }

  // // Обновление offer по id
  async updateOffer(dto: UpdateOfferDto, userId: number) {
    const offer = await this.prisma.offer.update({
      where: { id: dto.id, userId },
      data: {
        ...dto,
      },
      select: { ...returnOfferObject },
    });

    return offer;
  }

  // // Удаление offer по id
  async deleteOffer(id: number, userId: number) {
    await this.prisma.offer.delete({
      where: { id, userId },
    });

    return {
      message: 'Offer удален',
    };
  }
}
