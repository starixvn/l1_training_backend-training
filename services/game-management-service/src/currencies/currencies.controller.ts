import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrenciesResponse } from './models/currencies-response';

@ApiTags('currencies')
@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly service: CurrenciesService) {}

    @Get()
    @ApiOperation({ operationId: 'getCurrencies' })
    @ApiOkResponse({ type: CurrenciesResponse })
    async getCurrencies() {
        return this.service.getCurrencies();
    }
}
