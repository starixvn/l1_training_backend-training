import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type CurrencyGroupGamesDocument = CurrencyGroupGames & mongoose.Document;

@Schema()
export class CurrencyGroupGames {
    @ApiProperty()
    @Prop({ required: true })
    gameId: number;

    @ApiProperty()
    @Prop({ required: true })
    gameName: string;

    @ApiProperty({ type: String })
    @Prop({ required: true })
    groupId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    enabled: boolean;

    @ApiProperty()
    @Prop({ required: true })
    minBet: number;

    @ApiProperty()
    @Prop({ required: true })
    maxBet: number;

    @ApiProperty()
    @Prop({ type: Object })
    maxBetPerChoice: object;

    @ApiProperty({ type: [Number] })
    @Prop({ type: [Number] })
    chips: number[];

    @ApiProperty({ type: [Object] })
    @Prop({ type: [Object] })
    stakeLevels: object[];
}

export const CurrencyGroupGamesSchema = SchemaFactory.createForClass(CurrencyGroupGames);
