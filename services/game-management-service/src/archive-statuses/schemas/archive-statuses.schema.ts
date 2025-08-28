import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsObject, IsString } from 'class-validator';

export type ArchiveStatusesDocument = ArchiveStatuses & mongoose.Document;

@Schema()
export class ArchiveStatuses {
    @IsString()
    @Prop({ required: true })
    @ApiProperty()
    name: string;

    @IsObject()
    @Prop({ required: true, type: Object })
    @ApiProperty()
    lastArcId: object;
}

export const ArchiveStatusesSchema = SchemaFactory.createForClass(ArchiveStatuses);
