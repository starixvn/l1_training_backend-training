import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseJackpotRequest } from './base-jackpot-request';

export class ContributeJackpotRequest extends BaseJackpotRequest {
    @IsNumber()
    @ApiProperty()
    readonly amount: number;

    @IsNumber()
    @ApiProperty()
    readonly byBots: number;

    @IsNumber()
    @ApiProperty()
    readonly byMembers: number;
}
