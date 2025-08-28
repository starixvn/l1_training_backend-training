import { ApiProperty } from '@nestjs/swagger';
import { Result } from '../../common/models/result';
import { ArchiveStatuses } from '../schemas';

export class ArchiveStatusesResponse extends Result<ArchiveStatuses> {
    @ApiProperty()
    data: ArchiveStatuses;
}
