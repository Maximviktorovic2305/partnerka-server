import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { PrismaService } from 'src/prisma.service';
import { PartnerService } from 'src/partner/partner.service';
import { PartnerModule } from 'src/partner/partner.module';

@Module({
  imports: [PartnerModule],               
  controllers: [LeadController],
  providers: [LeadService, PrismaService, PartnerService],
})
export class LeadModule {}
