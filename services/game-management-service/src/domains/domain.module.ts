import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { Domains, DomainsSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: Domains.name, schema: DomainsSchema, collection: 'domains' }])],
    providers: [DomainService],
    exports: [DomainService],
    controllers: [DomainController],
})
export class DomainModule {}
