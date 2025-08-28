import { ApiProperty } from '@nestjs/swagger';
import { UpdateBalanceRequest } from './update-balance-request';
import { IsArray } from 'class-validator';

export class UpdateBotsBalanceRequest {
    @IsArray()
    @ApiProperty({ type: [UpdateBalanceRequest] })
    readonly bots: UpdateBalanceRequest[];
}
