import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ReferralLinkService } from 'src/referral-link/referral-link.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ReferralLinkService,PrismaService],
})
export class ConversationModule {}
