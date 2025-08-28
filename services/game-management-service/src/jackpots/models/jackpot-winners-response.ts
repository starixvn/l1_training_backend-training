import { Result } from '../../common/models/result';
import { Jackpots } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

class JackPotWinners {
    @ApiProperty({ type: [Jackpots] })
    winners: [Jackpots];

    @ApiProperty()
    total: number;
}
export class JackPotWinnersResponse extends Result<JackPotWinners> {
    @ApiProperty({ type: JackPotWinners })
    data: JackPotWinners;
}
