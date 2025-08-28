import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsString, IsObject } from 'class-validator';

export type OperatorConfigDocument = OperatorConfig & mongoose.Document;

@Schema()
export class OperatorConfig {
    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    type: string;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    partnerId: string;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    value: object;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    operatorId: string;
}

export const OperatorConfigSchema = SchemaFactory.createForClass(OperatorConfig);
