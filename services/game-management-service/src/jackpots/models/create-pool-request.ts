import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseJackpotRequest } from './base-jackpot-request';

export class CreatePoolRequest extends BaseJackpotRequest {
    @IsString()
    @ApiProperty()
    readonly gameName: string;

    @IsNumber()
    @ApiProperty()
    readonly amount: number;

    @IsNumber()
    @ApiProperty()
    readonly initAmount: number;
}
