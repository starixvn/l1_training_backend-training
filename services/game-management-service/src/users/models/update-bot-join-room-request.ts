import { IsString } from 'class-validator';
import { UpdateBotsOutRoomRequest } from './update-bot-request';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotsJoinRoomRequest extends UpdateBotsOutRoomRequest {
    @IsString()
    @ApiProperty()
    readonly gameName: string;
}
