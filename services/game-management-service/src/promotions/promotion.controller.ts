import { Controller, Get, Query } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { Promotion } from './schemas';
import { Result } from '../common/models/result';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromotionResponse } from './models/promotion-response';

@ApiTags('promotion')
@Controller('promotion')
export class PromotionController {
    constructor(private readonly service: PromotionService) {}

    @Get('/')
    @ApiOperation({ operationId: 'getPromotions' })
    @ApiOkResponse({ type: PromotionResponse })
    async getPromotions(@Query('gameId') gameId: number): Promise<Result<Promotion[]>> {
        return this.service.getPromotions(gameId);
    }
}
