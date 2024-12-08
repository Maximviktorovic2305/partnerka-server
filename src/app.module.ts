import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PartnerModule } from './partner/partner.module';
import { LeadModule } from './lead/lead.module';
import { ReferralLinkModule } from './referral-link/referral-link.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), PartnerModule, LeadModule, ReferralLinkModule],
})
export class AppModule {}
