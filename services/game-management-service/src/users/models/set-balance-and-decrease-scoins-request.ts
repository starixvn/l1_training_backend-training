import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { SetBalanceRequest } from './set-balance-request';

export class SetBalanceAndDecreaseScoinsRequest extends SetBalanceRequest {
    @IsNumber()
    @ApiProperty()
    readonly deductionscoins: number;
}
