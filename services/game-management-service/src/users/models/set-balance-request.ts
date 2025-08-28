import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SetBalanceRequest {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsNumber()
    @ApiProperty()
    readonly balance: number;
}
