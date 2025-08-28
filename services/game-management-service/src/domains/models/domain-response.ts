import { ApiProperty } from '@nestjs/swagger';
import { Result } from '../../common/models/result';
import { Domains } from '../schemas';

export class DomainResponse extends Result<Domains> {
    @ApiProperty()
    data: Domains;
}
