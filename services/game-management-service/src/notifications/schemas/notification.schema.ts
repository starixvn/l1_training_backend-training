import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsString, IsNumber, IsObject, IsDate } from 'class-validator';

export type NotificationDocument = Notification & mongoose.Document;

@Schema()
export class Notification {
    @IsDate()
    @Prop({ required: true })
    @ApiProperty()
    time: Date;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    message: string;

    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    displayKind: number;

    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    gameName: string;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object, required: true })
    messages: object;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
