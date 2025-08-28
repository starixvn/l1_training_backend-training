import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsString, IsNumber, IsObject, IsBoolean, IsArray } from 'class-validator';

export type GameConfigsDocument = GameConfigs & mongoose.Document;

@Schema()
export class GameConfigs {
    @IsString()
    @ApiProperty()
    @Prop({ required: true })
    name: string;

    @IsBoolean()
    @ApiProperty()
    @Prop({ required: true })
    enabled: boolean;

    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    minbet: number;

    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    maxbet: number;

    @IsNumber()
    @ApiProperty()
    @Prop()
    disabledround: number;

    @IsBoolean()
    @ApiProperty()
    @Prop({ default: false })
    botenabled: boolean;

    @IsNumber()
    @ApiProperty()
    @Prop({ required: true })
    maxbot: number;

    @IsNumber()
    @ApiProperty()
    @Prop()
    bot_maxbet: number; // NOSONAR

    @IsNumber()
    @ApiProperty()
    @Prop()
    bot_minbet: number; // NOSONAR

    @IsArray()
    @ApiProperty()
    @Prop()
    hour_maxbot: Array<any>; // NOSONAR

    @IsString()
    @ApiProperty()
    @Prop()
    disabled_message: string; // NOSONAR

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    choices_maxbet: object; // NOSONAR

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    odds: object;

    @IsNumber()
    @ApiProperty()
    @Prop()
    delayStartTime: number;

    @IsBoolean()
    @ApiProperty()
    @Prop({ default: false })
    enableFreeBet: boolean;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    slotsConfig: object;

    @IsArray()
    @ApiProperty()
    @Prop()
    siteExclusions: Array<any>;

    @IsBoolean()
    @ApiProperty()
    @Prop({ default: false })
    smartBotEnabled: boolean;

    @IsNumber()
    @ApiProperty()
    @Prop({ default: 0 })
    smartBotGroupRatio: number;

    @IsBoolean()
    @ApiProperty()
    @Prop({ default: false })
    exchangeReload: boolean;

    @IsNumber()
    @ApiProperty()
    @Prop()
    randomMode: number;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    cascadingSlotsConfig: object;

    @IsObject()
    @ApiProperty()
    @Prop({ type: Object })
    slotRNGConfig: object;

    @IsNumber()
    @ApiProperty()
    @Prop()
    gameId: number;

    @IsString()
    @ApiProperty()
    @Prop()
    displayName: string;

    @IsNumber()
    @ApiProperty()
    @Prop()
    type: number;
}

export const GameConfigsSchema = SchemaFactory.createForClass(GameConfigs);
