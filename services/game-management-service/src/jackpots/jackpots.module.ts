import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JackpotsService } from './jackpots.service';
import { JackpotsController } from './jackpots.controller';
import { Jackpots, JackpotsSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: Jackpots.name, schema: JackpotsSchema, collection: 'jackpots' }])],
    providers: [JackpotsService],
    exports: [JackpotsService],
    controllers: [JackpotsController],
})
export class JackpotsModule {}
