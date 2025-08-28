import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdCountersService } from './id-counters.service';
import { IdCountersController } from './id-counters.controller';
import { IdCounters, IdCountersSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: IdCounters.name, schema: IdCountersSchema, collection: 'idcounters' }])],
    providers: [IdCountersService],
    exports: [IdCountersService],
    controllers: [IdCountersController],
})
export class IdCountersModule {}
