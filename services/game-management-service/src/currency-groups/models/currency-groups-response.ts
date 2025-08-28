import { Result } from '../../common/models/result';
import { CurrencyGroups } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyGroupsResponse extends Result<CurrencyGroups[]> {
    @ApiProperty({ type: [CurrencyGroups] })
    data: CurrencyGroups[];
}
