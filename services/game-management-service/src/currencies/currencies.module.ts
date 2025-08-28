import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { Currencies, CurrenciesSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: Currencies.name, schema: CurrenciesSchema, collection: 'currencies' }])],
    providers: [CurrenciesService],
    exports: [CurrenciesService],
    controllers: [CurrenciesController],
})
export class CurrenciesModule {}
