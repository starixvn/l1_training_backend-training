import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsString, IsNumber, IsDate, IsObject } from 'class-validator';

export type ExchangeRatesDocument = ExchangeRates & mongoose.Document;

@Schema()
export class ExchangeRates {
    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    exId: number;

    @IsDate()
    @ApiProperty()
    @Prop({ required: true })
    time: Date;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    source: string;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object, required: true })
    code: object;
}

export const ExchangeRatesSchema = SchemaFactory.createForClass(ExchangeRates);
