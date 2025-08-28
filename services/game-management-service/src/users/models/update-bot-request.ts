import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class UpdateBotsOutRoomRequest {
    @IsArray()
    @IsString({ each: true })
    @ApiProperty()
    readonly botIds: string[];
}
