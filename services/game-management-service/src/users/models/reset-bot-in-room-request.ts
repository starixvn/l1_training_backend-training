import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetBotInRoomRequest {
    @IsString()
    @ApiProperty()
    readonly gameName: string;
}
