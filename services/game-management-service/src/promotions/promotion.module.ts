import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { Promotion, PromotionSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: Promotion.name, schema: PromotionSchema, collection: 'promotions' }])],
    providers: [PromotionService],
    exports: [PromotionService],
    controllers: [PromotionController],
})
export class PromotionModule {}
