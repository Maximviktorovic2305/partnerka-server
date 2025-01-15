import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [WithdrawController],
  providers: [WithdrawService, PrismaService],
  exports: [WithdrawService]
})
export class WithdrawModule {}
