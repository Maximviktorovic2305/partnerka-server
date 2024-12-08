import { Module } from '@nestjs/common';
import { ReferralLinkService } from './referral-link.service';
import { ReferralLinkController } from './referral-link.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReferralLinkController],
  providers: [ReferralLinkService, PrismaService],
})
export class ReferralLinkModule {}
