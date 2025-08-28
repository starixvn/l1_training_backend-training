import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameConfigsService } from './game-configs.service';
import { GameConfigsController } from './game-configs.controller';
import { GameConfigs, GameConfigsSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: GameConfigs.name, schema: GameConfigsSchema, collection: 'game_configs' }])],
    providers: [GameConfigsService],
    exports: [GameConfigsService],
    controllers: [GameConfigsController],
})
export class GameConfigsModule {}
