import { Controller, Get } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Domains } from './schemas';
import { Result } from '../common/models/result';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DomainResponse } from './models/domain-response';

@ApiTags('domain')
@Controller('domain')
export class DomainController {
    constructor(private readonly service: DomainService) {}

    @Get('')
    @ApiOperation({ operationId: 'getDomain' })
    @ApiOkResponse({ type: DomainResponse })
    async getDomain(): Promise<Result<Domains>> {
        return this.service.getDomains();
    }
}
