import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  CreateWithdrawDto,
  DeleteWithDrawDto,
  GetByIdWithdrawDto,
  GetPartnerWithdrawDto,
} from './dto/create-withdraw.dto';
import { UpdateManyWithdrawsDto, UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  // Создать выплату
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateWithdrawDto, @CurrentUser('id') userId: number) {
    return this.withdrawService.create(dto, userId);
  }

  // Получить выплату по id
  @Post('withdrawId')
  @Auth()
  getWithdrawById(@Body() dto: GetByIdWithdrawDto, @CurrentUser('id') userId: number) {
    return this.withdrawService.getWithdrawById(+dto.withdrawId, userId);
  }

  // Получить все выплаты партнера
  @Post('partnerId')
  @Auth()
  getAllPartnerWithdraws(@Body() dto: GetPartnerWithdrawDto, @CurrentUser('id') userId: number) {
    return this.withdrawService.getAllPartnerWithdraws(+dto.partnerId, userId);
  }

  // Получить все выплаты
  @Get()
  @Auth()
  getAllWithdraws(@CurrentUser('id') userId: number) {
    return this.withdrawService.getAllWithdraws(userId);
  }

   // Получить все непроведенные выплаты выплаты
   @Get('not-payd')
   @Auth()
   getAllIsNotPaydOutWithdraws(@CurrentUser('id') userId: number) {
     return this.withdrawService.getAllIsNotPaydOutWithdraws(userId);
   }

   // Получить все проведенные выплаты выплаты
   @Get('payd')
   @Auth()
   getAllIsPaydOutWithdraws(@CurrentUser('id') userId: number) {
     return this.withdrawService.getAllIsPaydOutWithdraws(userId);
   }

  // Обновить выплату
  @Put()
  @Auth()
  updateWithdraw(@Body() dto: UpdateWithdrawDto, @CurrentUser('id') userId: number) {
    return this.withdrawService.updateWithdraw(dto, userId);
  }

  // Обновить множество выплат
  @Put('update-many-isPaydOutTrue')
  @Auth()
  updateManyWithdrawsToPaydOut(@Body() dtos: UpdateManyWithdrawsDto[], @CurrentUser('id') userId: number) {
    return this.withdrawService.updateManyWithdrawsToPaydOut(dtos, userId);
  }

  // Удалить выплату
  @Delete()
  @Auth()
  deleteWithdraw(@Body() dto: DeleteWithDrawDto, @CurrentUser('id') userId: number) {
    return this.withdrawService.deleteWithdraw(+dto.withdrawId, userId);
  }
}
