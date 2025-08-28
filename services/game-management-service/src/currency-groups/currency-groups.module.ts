import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyGroupsService } from './currency-groups.service';
import { CurrencyGroupsController } from './currency-groups.controller';
import { CurrencyGroups, CurrencyGroupsSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: CurrencyGroups.name, schema: CurrencyGroupsSchema, collection: 'currency_groups' }])],
    providers: [CurrencyGroupsService],
    exports: [CurrencyGroupsService],
    controllers: [CurrencyGroupsController],
})
export class CurrencyGroupsModule {}
