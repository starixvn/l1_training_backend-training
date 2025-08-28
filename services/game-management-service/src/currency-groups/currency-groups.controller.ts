import { Controller, Get } from '@nestjs/common';
import { CurrencyGroupsService } from './currency-groups.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrencyGroupsResponse } from './models/currency-groups-response';

@ApiTags('currency-groups')
@Controller('currency-groups')
export class CurrencyGroupsController {
    constructor(private readonly service: CurrencyGroupsService) {}

    @Get()
    @ApiOperation({ operationId: 'getCurrencyGroups' })
    @ApiOkResponse({ type: CurrencyGroupsResponse })
    async getCurrencyGroups() {
        return this.service.getCurrencyGroups();
    }
}
