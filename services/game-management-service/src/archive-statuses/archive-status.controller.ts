import { Controller, Get, Query } from '@nestjs/common';
import { ArchiveStatusService } from './archive-status.service';
import { ArchiveStatuses } from './schemas';
import { Result } from '../common/models/result';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArchiveStatusesResponse } from './models/archive-statuses-response';

@ApiTags('archive-status')
@Controller('archive-status')
export class ArchiveStatusController {
    constructor(private readonly service: ArchiveStatusService) {}

    @Get('')
    @ApiOperation({ operationId: 'getArchiveStatus' })
    @ApiOkResponse({ type: ArchiveStatusesResponse })
    async getArchiveStatus(@Query('gameName') gameName: string): Promise<Result<ArchiveStatuses>> {
        return this.service.getArchiveStatus(gameName);
    }
}
