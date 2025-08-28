import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateStakeLevelRequest {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsNumber()
    @ApiProperty()
    readonly minBet: number;

    @IsNumber()
    @ApiProperty()
    readonly maxBet: number;
}
