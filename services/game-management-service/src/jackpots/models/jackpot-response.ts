import { Result } from '../../common/models/result';
import { Jackpots } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class JackPotResponse extends Result<Jackpots> {
    @ApiProperty()
    data: Jackpots;
}
