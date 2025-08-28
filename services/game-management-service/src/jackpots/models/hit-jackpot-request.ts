import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseJackpotRequest } from './base-jackpot-request';

export class HitJackpotRequest extends BaseJackpotRequest {
    @IsNumber()
    @ApiProperty()
    readonly winningRatio: number;

    @IsString()
    @ApiProperty()
    readonly winnerName: string;

    @IsNumber()
    @ApiProperty()
    readonly winnerId: number;

    @IsNumber()
    @ApiProperty()
    readonly rate: number;

    @IsNumber()
    @ApiProperty()
    readonly exchangeRateId: number;

    @IsString()
    @ApiProperty()
    readonly operatorId: string;

    @IsString()
    @ApiProperty()
    readonly currency: string;
}
