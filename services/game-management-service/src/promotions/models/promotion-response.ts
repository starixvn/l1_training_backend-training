import { ApiProperty } from '@nestjs/swagger';
import { Result } from '../../common/models/result';
import { Promotion } from '../schemas';

export class PromotionResponse extends Result<Promotion[]> {
    @ApiProperty({ type: [Promotion] })
    data: Promotion[];
}
