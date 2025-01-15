import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { PrismaService } from 'src/prisma.service';
import { PartnerService } from 'src/partner/partner.service';
import { PartnerModule } from 'src/partner/partner.module';
import { WithdrawService } from 'src/withdraw/withdraw.service';

@Module({
  imports: [PartnerModule],               
  controllers: [LeadController],
  providers: [LeadService, PrismaService, PartnerService, WithdrawService],
})
export class LeadModule {}
