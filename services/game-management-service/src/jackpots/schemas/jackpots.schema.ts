import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type JackpotsDocument = Jackpots & mongoose.Document;

@Schema()
export class Jackpots {
    @ApiProperty()
    @Prop({ required: true })
    gameId: number;

    @ApiProperty()
    @Prop({ required: true })
    gameName: string;

    @ApiProperty()
    @Prop({ required: true })
    pool: number;

    @ApiProperty()
    @Prop({ required: true })
    initAmount: number;

    @ApiProperty()
    @Prop({ default: 0 })
    amount: number;

    @ApiProperty()
    @Prop()
    winningRatio: number;

    @ApiProperty()
    @Prop()
    winnerName: string;

    @ApiProperty()
    @Prop()
    winnerId: number;

    @ApiProperty()
    @Prop({ default: 0 })
    byBots: number;

    @ApiProperty()
    @Prop({ default: 0 })
    byMembers: number;

    @ApiProperty()
    @Prop({ required: true })
    createdAt: number;

    @ApiProperty()
    @Prop()
    hitAt: number;

    @Prop({ required: true })
    createdTime: Date;

    @Prop()
    hitTime: Date;

    @ApiProperty()
    @Prop()
    rate: number;

    @ApiProperty()
    @Prop()
    exchangeRateId: number;

    @ApiProperty()
    @Prop()
    operatorId: string;

    @ApiProperty()
    @Prop()
    currency: string;
}

export const JackpotsSchema = SchemaFactory.createForClass(Jackpots);
