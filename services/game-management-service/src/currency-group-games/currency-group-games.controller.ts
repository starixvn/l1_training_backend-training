import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CurrencyGroupGamesService } from './currency-group-games.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrencyGroupGamesResponse } from './models/currency-group-games-response';

@ApiTags('currency-group-games')
@Controller('currency-group-games')
export class CurrencyGroupGamesController {
    constructor(private readonly service: CurrencyGroupGamesService) {}

    @Get()
    @ApiOperation({ operationId: 'getCurrencyGroupGamesByGameId' })
    @ApiOkResponse({ type: CurrencyGroupGamesResponse })
    async getCurrencyGroupGamesByGameId(@Query('gameId', ParseIntPipe) gameId: number) {
        return this.service.getCurrencyGroupGamesByGameId(gameId);
    }
}
