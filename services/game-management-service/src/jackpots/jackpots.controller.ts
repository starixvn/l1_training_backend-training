import { Body, Controller, Get, Post, ParseIntPipe, Query } from '@nestjs/common';
import { JackpotsService } from './jackpots.service';
import {
    ContributeJackpotRequest,
    CreatePoolRequest,
    HitJackpotRequest,
    JackPotResponse,
    JackPotWinnersResponse,
    JackPotsResponse,
} from './models';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NumericalResult } from '../common/models/result';

@ApiTags('jackpots')
@Controller('jackpots')
export class JackpotsController {
    constructor(private readonly service: JackpotsService) {}

    @Get('pools')
    @ApiOperation({ operationId: 'getPools' })
    @ApiOkResponse({ type: JackPotsResponse })
    async getPools(@Query('gameId', ParseIntPipe) gameId: number) {
        return this.service.getPools(gameId);
    }

    @Post('pools')
    @ApiOperation({ operationId: 'createPool' })
    @ApiOkResponse({ type: JackPotResponse })
    async createPool(@Body() body: CreatePoolRequest) {
        return this.service.createNewPool(body);
    }

    @Get('pools/total-existing-pools')
    @ApiOperation({ operationId: 'getTotalExistingPools' })
    @ApiOkResponse({ type: NumericalResult })
    async getTotalExistingPools(@Query('gameId', ParseIntPipe) gameId: number, @Query('pool', ParseIntPipe) pool: number) {
        return this.service.getTotalExistingPools(gameId, pool);
    }

    @Get('latest-roundid')
    @ApiOperation({ operationId: 'getLatestRoundId' })
    @ApiOkResponse({ type: NumericalResult })
    async getLatestRoundId(@Query('gameId', ParseIntPipe) gameId: number) {
        return this.service.getLatestRoundId(gameId);
    }

    @Get('winners')
    @ApiOperation({ operationId: 'getJackpotWinners' })
    @ApiOkResponse({ type: JackPotWinnersResponse })
    async getJackpotWinners(
        @Query('gameId', ParseIntPipe) gameId: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ) {
        return this.service.getJackpotWinners(gameId, page, pageSize);
    }

    @Post('contribute')
    @ApiOperation({ operationId: 'contributeJackpot' })
    @ApiOkResponse({ type: JackPotResponse })
    async contributeJackpot(@Body() body: ContributeJackpotRequest) {
        return this.service.contributeJackpot(body);
    }

    @Post('hit')
    @ApiOperation({ operationId: 'hitJackpot' })
    @ApiOkResponse({ type: JackPotResponse })
    async hitJackpot(@Body() body: HitJackpotRequest) {
        return this.service.hitJackpot(body);
    }
}
