import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateBalanceRequest {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsNumber()
    @ApiProperty()
    readonly deductionAmount: number;
}
