import { Result } from '../../common/models/result';
import { Jackpots } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class JackPotsResponse extends Result<Jackpots[]> {
    @ApiProperty({ type: [Jackpots] })
    data: Jackpots[];
}
