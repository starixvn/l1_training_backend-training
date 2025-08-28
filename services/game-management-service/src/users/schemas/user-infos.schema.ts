import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type UserInfosDocument = UserInfos & mongoose.Document;

@Schema()
class Settings {
    @ApiProperty()
    @Prop({ default: undefined })
    quickBet: boolean;

    @ApiProperty()
    @Prop({ default: '' })
    theme: string;
}

const SettingsSchema = SchemaFactory.createForClass(Settings);

@Schema()
export class UserInfos {
    @ApiProperty()
    @Prop({ required: true, unique: true })
    id: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    UID: number;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    name: string;

    @ApiProperty()
    @Prop({ default: new Date() })
    joinedOn: Date;

    @ApiProperty()
    @Prop({ default: 0 })
    red: number;

    @Prop({ default: 0 })
    redWin: number;

    @Prop({ default: 0 })
    redLost: number;

    @Prop({ default: 0 })
    redPlay: number;

    @ApiProperty()
    @Prop({ default: false })
    type: boolean;

    @ApiProperty()
    @Prop({ default: 0 })
    avatarId: number;

    @ApiProperty()
    @Prop({ default: '' })
    currency: string;

    @ApiProperty()
    @Prop({ default: false })
    inRoom: boolean;

    @ApiProperty()
    @Prop({ default: false })
    disabled: boolean;

    @ApiProperty()
    @Prop({ default: '' })
    inGameRoom: string;

    @Prop({ default: false })
    banned: boolean;

    @ApiProperty()
    @Prop({ default: 0 })
    minBet: number;

    @ApiProperty()
    @Prop({ default: 0 })
    maxBet: number;

    @Prop()
    betLimitModifiedDate: Date;

    @ApiProperty()
    @Prop({ type: SettingsSchema })
    settings: Settings;

    @Prop({ default: false })
    isSignedInSM: boolean;

    @ApiProperty()
    @Prop({ default: 0 })
    scoins: number;
}

export const UserInfosSchema = SchemaFactory.createForClass(UserInfos);
