import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type IdCountersDocument = IdCounters & mongoose.Document;

@Schema()
export class IdCounters {
    @ApiProperty()
    @Prop({ required: true, default: 0 })
    c: number;

    @ApiProperty()
    @Prop({ required: true })
    f: string;

    @ApiProperty()
    @Prop({ required: true })
    m: string;
}

export const IdCountersSchema = SchemaFactory.createForClass(IdCounters);
