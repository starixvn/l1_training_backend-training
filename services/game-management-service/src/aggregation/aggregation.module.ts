import { Module } from '@nestjs/common';
import { AggregationController } from './aggregation.controller';
import { AggregationService } from './aggregation.service';
import { CurrencyGroupGamesModule } from '../currency-group-games/currency-group-games.module';
import { CurrencyGroupsModule } from '../currency-groups/currency-groups.module';
import { OperatorConfigModule } from '../operator-configs/operator-config.module';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
    imports: [CurrencyGroupGamesModule, CurrencyGroupsModule, OperatorConfigModule, CurrenciesModule],
    providers: [AggregationService],
    exports: [AggregationService],
    controllers: [AggregationController],
})
export class AggregationModule {}
