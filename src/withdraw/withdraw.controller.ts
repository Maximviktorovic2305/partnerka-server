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
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  // Создать выплату
  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateWithdrawDto) {
    return this.withdrawService.create(dto);
  }

  // Получить выплату по id
  @Post('withdrawId')
  @Auth()
  getWithdrawById(@Body() dto: GetByIdWithdrawDto) {
    return this.withdrawService.getWithdrawById(+dto.withdrawId);
  }

  // Получить все выплаты партнера
  @Post('partnerId')
  @Auth()
  getAllPartnerWithdraws(@Body() dto: GetPartnerWithdrawDto) {
    return this.withdrawService.getAllPartnerWithdraws(+dto.partnerId);
  }

  // Получить все выплаты
  @Get()
  @Auth()
  getAllWithdraws() {
    return this.withdrawService.getAllWithdraws();
  }

   // Получить все непроведенные выплаты выплаты
   @Get('not-payd')
   @Auth()
   getAllIsNotPaydOutWithdraws() {
     return this.withdrawService.getAllIsNotPaydOutWithdraws();
   }

   // Получить все проведенные выплаты выплаты
   @Get('payd')
   @Auth()
   getAllIsPaydOutWithdraws() {
     return this.withdrawService.getAllIsPaydOutWithdraws();
   }

  // Обновить выплату
  @Put()
  @Auth()
  updateWithdraw(@Body() dto: UpdateWithdrawDto) {
    return this.withdrawService.updateWithdraw(dto);
  }

  // Удалить выплату
  @Delete()
  @Auth()
  deleteWithdraw(@Body() dto: DeleteWithDrawDto) {
    return this.withdrawService.deleteWithdraw(+dto.withdrawId);
  }
}
