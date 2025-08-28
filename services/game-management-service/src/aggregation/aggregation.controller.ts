import { Controller, Get, Query } from '@nestjs/common';
import { Result } from '../common/models/result';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingForNewRoundResponse, SettingForNewRound } from './models/settings-for-new-round';
import { AggregationService } from './aggregation.service';

@ApiTags('aggregation')
@Controller('aggregation')
export class AggregationController {
    constructor(private readonly service: AggregationService) {}

    @Get('get-setting-for-new-round')
    @ApiOperation({ operationId: 'getSettingForNewRound' })
    @ApiOkResponse({ type: SettingForNewRoundResponse })
    async getSettingForNewRound(@Query('gameId') gameId: number): Promise<Result<SettingForNewRound>> {
        return this.service.getSettingForNewRound(gameId);
    }
}
