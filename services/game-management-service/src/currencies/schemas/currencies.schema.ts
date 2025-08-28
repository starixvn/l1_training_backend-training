import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type CurrenciesDocument = Currencies & mongoose.Document;

@Schema()
export class Currencies {
    @Prop({ required: true })
    enabled: boolean;

    @ApiProperty()
    @Prop({ required: true })
    name: string;

    @ApiProperty()
    @Prop({ required: true })
    code: string;

    @ApiProperty()
    @Prop({ required: true })
    multiplier: number;

    @ApiProperty()
    @Prop({ required: true })
    isTest: boolean;

    @ApiProperty()
    @Prop({ required: true })
    partnerId: string;

    @ApiProperty({ type: String })
    @Prop({ required: true })
    groupId: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop()
    isUncountOnTotal: boolean;
}

export const CurrenciesSchema = SchemaFactory.createForClass(Currencies);
