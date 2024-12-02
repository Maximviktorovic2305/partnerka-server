import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, PrismaService],
  exports: [PartnerService]
})
export class PartnerModule {}
