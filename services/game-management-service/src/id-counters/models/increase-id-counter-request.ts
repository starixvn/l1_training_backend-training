import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IncreaseIdCounterRequest {
    @IsString()
    @ApiProperty()
    readonly gameName: string;

    @IsString()
    @ApiProperty()
    readonly modelName: string;
}
