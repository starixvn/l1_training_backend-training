import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRates, ExchangeRatesSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: ExchangeRates.name, schema: ExchangeRatesSchema, collection: 'exchange_rates' }])],
    providers: [ExchangeRateService],
    exports: [ExchangeRateService],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}
