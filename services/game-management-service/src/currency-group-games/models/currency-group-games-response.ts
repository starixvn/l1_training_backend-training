import { Result } from '../../common/models/result';
import { CurrencyGroupGames } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyGroupGamesResponse extends Result<CurrencyGroupGames[]> {
    @ApiProperty({ type: [CurrencyGroupGames] })
    data: CurrencyGroupGames[];
}
