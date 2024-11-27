import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { returnPartnerObject } from './return-partner.object';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать партнера
  async create(createPartnerDto: CreatePartnerDto) {
    const partnerByEmail = await this.prisma.partner.findUnique({ where: { email: createPartnerDto.email } });
    if (partnerByEmail) throw new BadRequestException('Партнер с таким email уже существует')

    const partner = await this.prisma.partner.create({
      data: { ...createPartnerDto },
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

  // Получить всез партнеров
  async getAllPartners() {
    const partners = await this.prisma.partner.findMany({
      select: { ...returnPartnerObject },
    });

    return partners;
  }

  // Обновить партнера
  async updatePartner(partnerId: number, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.update({
      where: { id: partnerId },
      data: { ...updatePartnerDto },
      select: { ...returnPartnerObject },
    });

    return partner;
  }

  // Удалить партнера
  async deletePartner(partnerId: number) {
    await this.prisma.partner.delete({
      where: { id: partnerId },
    });

    return { message: 'Партнер удален' };
  }
}
