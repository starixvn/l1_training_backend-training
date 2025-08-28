import { ApiProperty } from '@nestjs/swagger';
import { Result } from '../../common/models/result';
import { CurrencyGroupGames } from '../../currency-group-games/schemas';
import { OperatorConfig } from '../../operator-configs/schemas';
import { CurrencyGroups } from '../../currency-groups/schemas';
import { Currencies } from '../../currencies/schemas';

export class SettingForNewRound {
    constructor(
        currencyGroupGames: CurrencyGroupGames[],
        partnerGameSiteExclusions: OperatorConfig[],
        currencyGroups: CurrencyGroups[],
        currencies: Currencies[],
    ) {
        this.currencyGroupGames = currencyGroupGames;
        this.partnerGameSiteExclusions = partnerGameSiteExclusions;
        this.currencyGroups = currencyGroups;
        this.currencies = currencies;
    }

    currencyGroupGames: CurrencyGroupGames[];
    partnerGameSiteExclusions: OperatorConfig[];
    currencyGroups: CurrencyGroups[];
    currencies: Currencies[];
}

export class SettingForNewRoundResponse extends Result<SettingForNewRound> {
    @ApiProperty()
    data: SettingForNewRound;
}
