import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { GameConfigsModule } from './game-configs/game-configs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrenciesModule } from './currencies/currencies.module';
import { CurrencyGroupsModule } from './currency-groups/currency-groups.module';
import { CurrencyGroupGamesModule } from './currency-group-games/currency-group-games.module';
import { AuthenticateMiddleware } from './middlewares/authenticate.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ArchiveStatusModule } from './archive-statuses/archive-status.module';
import { PromotionModule } from './promotions/promotion.module';
import { OperatorConfigModule } from './operator-configs/operator-config.module';
import { DomainModule } from './domains/domain.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notifications/notification.module';
import { JackpotsModule } from './jackpots/jackpots.module';
import { ExchangeRateModule } from './exchange-rates/exchange-rate.module';
import { IdCountersModule } from './id-counters/id-counters.module';
import { AggregationModule } from './aggregation/aggregation.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                ...configService.get('database'),
            }),
            inject: [ConfigService],
        }),
        JwtModule.register({}),
        CommonModule,
        CurrenciesModule,
        CurrencyGroupGamesModule,
        CurrencyGroupsModule,
        GameConfigsModule,
        ArchiveStatusModule,
        PromotionModule,
        OperatorConfigModule,
        DomainModule,
        UsersModule,
        NotificationModule,
        JackpotsModule,
        ExchangeRateModule,
        IdCountersModule,
        AggregationModule,
        CacheModule.register(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).exclude('/', 'api(.*)').forRoutes('*');
    }
}
