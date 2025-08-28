import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsNumber, IsDate, IsBoolean } from 'class-validator';

export type PromotionDocument = Promotion & mongoose.Document;

@Schema()
export class Promotion {
    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    gameId: number;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object, required: true })
    odds: object;

    @IsDate()
    @ApiProperty()
    @Prop({ required: true })
    startDateTime: Date;

    @IsDate()
    @ApiProperty()
    @Prop({ required: true })
    endDateTime: Date;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    status: string;

    @IsBoolean()
    @ApiProperty()
    @Prop({ required: true })
    isDaily: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
