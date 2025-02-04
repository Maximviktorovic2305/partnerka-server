import { PartialType } from '@nestjs/mapped-types';
import { CreateWithdrawDto } from './create-withdraw.dto';

export class UpdateWithdrawDto extends PartialType(CreateWithdrawDto) {
   id: number
}

export class UpdateManyWithdrawsDto extends PartialType(UpdateWithdrawDto) {
   id: number
}

