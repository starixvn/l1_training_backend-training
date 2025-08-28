import { Injectable } from '@nestjs/common';
import { SettingForNewRound } from './models/settings-for-new-round';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';
import { CurrencyGroupGamesService } from '../currency-group-games/currency-group-games.service';
import { CurrencyGroupsService } from '../currency-groups/currency-groups.service';
import { OperatorConfigService } from '../operator-configs/operator-config.service';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class AggregationService {
    constructor(
        private readonly currencyGroupGamesService: CurrencyGroupGamesService,
        private readonly currencyGroupsService: CurrencyGroupsService,
        private readonly operatorConfigService: OperatorConfigService,
        private readonly currenciesService: CurrenciesService,
        private readonly logger: SentryLogger,
    ) {}

    async getSettingForNewRound(gameId: number): Promise<Result<SettingForNewRound>> {
        try {
            const currencyGroupGames = await this.currencyGroupGamesService.getCurrencyGroupGamesByGameId(gameId);
            const partnerGameSiteExclusions = await this.operatorConfigService.getGameSiteExclusions();
            const currencyGroups = await this.currencyGroupsService.getCurrencyGroups();
            const currencies = await this.currenciesService.getCurrencies();

            return new Result(
                ErrorCodes.Success,
                ErrorMessages.Empty,
                new SettingForNewRound(currencyGroupGames.data, partnerGameSiteExclusions.data, currencyGroups.data, currencies.data),
            );
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
