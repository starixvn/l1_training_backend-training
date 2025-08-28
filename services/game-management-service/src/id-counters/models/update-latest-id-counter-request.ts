import { IsNumber } from 'class-validator';
import { IncreaseIdCounterRequest } from './increase-id-counter-request';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLatestIdCounterRequest extends IncreaseIdCounterRequest {
    @IsNumber()
    @ApiProperty()
    readonly id: number;
}
