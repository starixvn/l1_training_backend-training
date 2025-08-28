import { Controller, Get } from '@nestjs/common';
import { OperatorConfigService } from './operator-config.service';
import { Result } from '../common/models/result';
import { OperatorConfig } from './schemas';
import { OperatorConfigsResponse } from './models/operator-configs-response';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('operator-config')
@Controller('operator-config')
export class OperatorConfigController {
    constructor(private readonly service: OperatorConfigService) {}

    @Get('game-site-exclusions')
    @ApiOperation({ operationId: 'getGameSiteExclusions' })
    @ApiOkResponse({ type: OperatorConfigsResponse })
    async getGameSiteExclusions(): Promise<Result<OperatorConfig[]>> {
        return this.service.getGameSiteExclusions();
    }
}
