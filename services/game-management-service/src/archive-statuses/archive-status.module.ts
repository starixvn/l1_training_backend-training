import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchiveStatusService } from './archive-status.service';
import { ArchiveStatusController } from './archive-status.controller';
import { ArchiveStatuses, ArchiveStatusesSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: ArchiveStatuses.name, schema: ArchiveStatusesSchema, collection: 'archive_statuses' }])],
    providers: [ArchiveStatusService],
    exports: [ArchiveStatusService],
    controllers: [ArchiveStatusController],
})
export class ArchiveStatusModule {}
