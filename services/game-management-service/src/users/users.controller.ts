import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NumericalResult, Result } from '../common/models/result';
import {
    BotsResponse,
    ResetBotInRoomRequest,
    SetBalanceAndDecreaseScoinsRequest,
    SetBalanceRequest,
    UpdateBalanceRequest,
    UpdateBotsJoinRoomRequest,
    UpdateBotsOutRoomRequest,
    UpdateStakeLevelRequest,
    UserInfoResponse,
    UpdateBotsBalanceRequest,
    UpdateBotsBalanceResponse,
} from './models';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('bots')
    @ApiOperation({ operationId: 'getAllBots' })
    @ApiOkResponse({ type: BotsResponse })
    async getAllBots(@Query('limit', ParseIntPipe) limit: number) {
        return this.usersService.getAllBots(limit);
    }

    @Get('bots/total')
    @ApiOperation({ operationId: 'getTotalBots' })
    @ApiOkResponse({ type: NumericalResult })
    async getTotalBots() {
        return this.usersService.getTotalBots();
    }

    @Get('bots/disabled-bots')
    @ApiOperation({ operationId: 'getDisableBots' })
    @ApiOkResponse({ type: BotsResponse })
    async getDisableBots() {
        return this.usersService.getDisableBots();
    }

    @Post('bots/out-room')
    @ApiOperation({ operationId: 'updateBotsOutRoom' })
    @ApiOkResponse({ type: Result })
    async updateBotsOutRoom(@Body() body: UpdateBotsOutRoomRequest) {
        return this.usersService.updateBotsOutRoom(body.botIds);
    }

    @Post('bots/join-room')
    @ApiOperation({ operationId: 'updateBotsJoinRoom' })
    @ApiOkResponse({ type: Result })
    async updateBotsJoinRoom(@Body() body: UpdateBotsJoinRoomRequest) {
        return this.usersService.updateBotsJoinRoom(body.botIds, body.gameName);
    }

    @Post('bots/reset-in-room')
    @ApiOperation({ operationId: 'resetBotsInRoom' })
    @ApiOkResponse({ type: Result })
    async resetBotsInRoom(@Body() body: ResetBotInRoomRequest) {
        return this.usersService.resetBotsInRoom(body.gameName);
    }

    @Get('info')
    @ApiOperation({ operationId: 'getUserInfo' })
    @ApiOkResponse({ type: UserInfoResponse })
    async getUserInfo(@Query('id') id: string) {
        return this.usersService.getUserInfo(id);
    }

    @Get('scoins')
    @ApiOperation({ operationId: 'getUserScoins' })
    @ApiOkResponse({ type: NumericalResult })
    async getUserScoins(@Query('id') id: string) {
        return this.usersService.getScoins(id);
    }

    @Post('update-stake-level')
    @ApiOperation({ operationId: 'updateUserStakeLevel' })
    @ApiOkResponse({ type: Result })
    async updateUserStakeLevel(@Body() body: UpdateStakeLevelRequest) {
        return this.usersService.updateStakeLevel(body);
    }

    @Post('update-balance')
    @ApiOperation({ operationId: 'updateBalance' })
    @ApiOkResponse({ type: UserInfoResponse })
    async updateBalance(@Body() body: UpdateBalanceRequest) {
        return this.usersService.updateBalance(body);
    }

    @Post('update-bots-balance')
    @ApiOperation({ operationId: 'updateBotsBalance' })
    @ApiOkResponse({ type: UpdateBotsBalanceResponse })
    async updateBotsBalance(@Body() body: UpdateBotsBalanceRequest) {
        return this.usersService.updateBotsBalance(body);
    }

    @Post('set-balance')
    @ApiOperation({ operationId: 'setBalance' })
    @ApiOkResponse({ type: UserInfoResponse })
    async setBalance(@Body() body: SetBalanceRequest) {
        return this.usersService.setBalance(body.id, body.balance);
    }

    @Post('set-balance-and-decrease-scoins')
    @ApiOperation({ operationId: 'setBalanceAndDecreaseScoins' })
    @ApiOkResponse({ type: UserInfoResponse })
    async setBalanceAndDecreaseScoins(@Body() body: SetBalanceAndDecreaseScoinsRequest) {
        return this.usersService.setBalanceAndUpdateScoins(body.id, body.balance, body.deductionscoins);
    }
}
