import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BaseJackpotRequest {
    @IsNumber()
    @ApiProperty()
    readonly gameId: number;

    @IsNumber()
    @ApiProperty()
    readonly pool: number;

    @IsNumber()
    @ApiProperty()
    readonly roundId: number;
}
