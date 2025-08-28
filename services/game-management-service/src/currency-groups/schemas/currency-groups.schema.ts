import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type CurrencyGroupsDocument = CurrencyGroups & mongoose.Document;

@Schema()
export class CurrencyGroups {
    @Prop({ required: true })
    enabled: boolean;

    @Prop({ required: true })
    @ApiProperty()
    name: string;

    @Prop({ required: true })
    @ApiProperty()
    partnerId: string;

    @Prop()
    @ApiProperty()
    fractionalOddsFormat: boolean;
}

export const CurrencyGroupsSchema = SchemaFactory.createForClass(CurrencyGroups);
