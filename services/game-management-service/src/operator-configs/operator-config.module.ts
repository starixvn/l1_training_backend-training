import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorConfigService } from './operator-config.service';
import { OperatorConfigController } from './operator-config.controller';
import { OperatorConfig, OperatorConfigSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: OperatorConfig.name, schema: OperatorConfigSchema, collection: 'partner_configs' }])],
    providers: [OperatorConfigService],
    exports: [OperatorConfigService],
    controllers: [OperatorConfigController],
})
export class OperatorConfigModule {}
