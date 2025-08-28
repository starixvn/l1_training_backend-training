import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameConfigsService } from './game-configs.service';
import { Result } from '../common/models/result';
import { GameConfigs } from './schemas';
import { GameConfigResponse } from './models/game-config-response';

@ApiBearerAuth()
@ApiTags('game-configs')
@Controller('game-configs')
export class GameConfigsController {
    constructor(private readonly service: GameConfigsService) {}

    @Get('')
    @ApiOperation({ operationId: 'getGameConfigs' })
    @ApiOkResponse({ type: GameConfigResponse })
    async getGameConfigs(@Query('gameName') gameName: string): Promise<Result<GameConfigs>> {
        return this.service.getGameConfigs(gameName);
    }

    @Get('byid')
    @ApiOperation({ operationId: 'getGameConfigsById' })
    @ApiOkResponse({ type: GameConfigResponse })
    async getGameConfigsById(@Query('gameId') gameId: number): Promise<Result<GameConfigs>> {
        return this.service.getGameConfigsById(gameId);
    }

    @Post('exchange-reload')
    @ApiOperation({ operationId: 'updateExchangeReload' })
    @ApiParam({ name: 'gameName', type: 'string' })
    @ApiParam({ name: 'exchangeReload', type: 'boolean' })
    @ApiOkResponse({ type: Result })
    async updateExchangeReload(@Body() body): Promise<Result<any>> {
        return this.service.updateExchangeReload(body.gameName, body.exchangeReload);
    }

    @Post('disabled-round')
    @ApiOperation({ operationId: 'updateDisabledround' })
    @ApiParam({ name: 'gameName', type: 'string' })
    @ApiParam({ name: 'roundId', type: 'number' })
    @ApiOkResponse({ type: Result })
    async updateDisabledround(@Body() body): Promise<Result<any>> {
        return this.service.updateDisabledround(body.gameName, body.roundId);
    }
}
