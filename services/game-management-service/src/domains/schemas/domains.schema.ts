import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export type DomainsDocument = Domains & mongoose.Document;

@Schema()
export class Domains {
    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    value: string;
}

export const DomainsSchema = SchemaFactory.createForClass(Domains);
