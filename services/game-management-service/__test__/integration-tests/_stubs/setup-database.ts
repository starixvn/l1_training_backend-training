import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types, Decimal128 } from 'mongoose';
import { GameConfigsDocument, GameConfigs } from '../../../src/game-configs/schemas';
import { ArchiveStatuses, ArchiveStatusesDocument } from '../../../src/archive-statuses/schemas';
import { Promotion, PromotionDocument } from '../../../src/promotions/schemas';
import { OperatorConfig, OperatorConfigDocument } from '../../../src/operator-configs/schemas';
import { Domains, DomainsDocument } from '../../../src/domains/schemas';
import { Notification, NotificationDocument } from '../../../src/notifications/schemas';
import { ExchangeRates, ExchangeRatesDocument } from '../../../src/exchange-rates/schemas';
import { CurrencyGroupGames, CurrencyGroupGamesDocument } from '../../../src/currency-group-games/schemas';
import { CurrencyGroups, CurrencyGroupsDocument } from '../../../src/currency-groups/schemas';
import { Currencies, CurrenciesDocument } from '../../../src/currencies/schemas';
import { UserInfos, UserInfosDocument } from '../../../src/users/schemas';

export const setupDatabase = async (moduleFixture: TestingModule) => {
    await initGameConfigs(moduleFixture);
    await initArchiveStatues(moduleFixture);
    await initPromotion(moduleFixture);
    await initOperatorConfig(moduleFixture);
    await initDomain(moduleFixture);
    await initNotification(moduleFixture);
    await initExchangeRates(moduleFixture);
    await initCurrencyGroupGames(moduleFixture);
    await initCurrencyGroup(moduleFixture);
    await initCurrencies(moduleFixture);
    await initUserInfos(moduleFixture);
};

const initUserInfos = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('UserInfos')) as Model<UserInfosDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item1 = new UserInfos();
    item1.id = '1';
    item1.UID = 1;
    item1.name = 'user 1';
    item1.red = 100;

    const item2 = new UserInfos();
    item2.id = '2';
    item2.UID = 2;
    item2.name = 'user 2';
    item2.red = 5;

    await model.insertMany([item1, item2]);
};

const initCurrencyGroupGames = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('CurrencyGroupGames')) as Model<CurrencyGroupGamesDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new CurrencyGroupGames();
    item.gameId = 12;
    item.gameName = 'baccarat';
    item.groupId = new Types.ObjectId('507f1f77bcf86cd799439011'); // 使用有效的 ObjectId
    item.enabled = true;
    item.minBet = 1;
    item.maxBet = 10;

    await model.insertMany([item]);
};

const initCurrencyGroup = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('CurrencyGroups')) as Model<CurrencyGroupsDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new CurrencyGroups();
    item.name = 'US';
    item.enabled = true;
    item.partnerId = 'p1';

    await model.insertMany([item]);
};

const initCurrencies = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('Currencies')) as Model<CurrenciesDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new Currencies();
    item.name = 'US';
    item.code = 'US';
    item.enabled = true;
    item.multiplier = 10;
    item.isTest = false;
    item.partnerId = 'p1';
    item.groupId = new Types.ObjectId('507f1f77bcf86cd799439012'); // 使用有效的 ObjectId

    await model.insertMany([item]);
};

const initGameConfigs = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('GameConfigs')) as Model<GameConfigsDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new GameConfigs();
    item.name = 'baccarat';
    item.enabled = true;
    item.minbet = 1;
    item.maxbet = 10;
    item.disabledround = 1;
    item.botenabled = true;
    item.botenabled = true;
    item.maxbot = 12;

    await model.insertMany([item]);
};

const initArchiveStatues = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('ArchiveStatuses')) as Model<ArchiveStatusesDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new ArchiveStatuses();
    item.name = 'baccarat';
    item.lastArcId = { _rounds: 5 };

    await model.insertMany([item]);
};

const initPromotion = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('Promotion')) as Model<PromotionDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new Promotion();
    item.gameId = 12;
    item.odds = { big: 2, small: 2 };
    item.startDateTime = new Date();
    item.endDateTime = new Date();
    item.status = 'enabled';
    item.isDaily = true;

    await model.insertMany([item]);
};

const initOperatorConfig = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('OperatorConfig')) as Model<OperatorConfigDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new OperatorConfig();
    item.type = 'game_site_exclusions';
    item.partnerId = 'OW';
    item.value = [{ 10: ['site1'] }];
    item.operatorId = '123';

    await model.insertMany([item]);
};

const initDomain = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('Domains')) as Model<DomainsDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new Domains();
    item.value = 'lumigame.com;luminetsoft.com';

    await model.insertMany([item]);
};

const initNotification = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('Notification')) as Model<NotificationDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new Notification();
    item.time = new Date();
    item.message = 'um now';
    item.displayKind = 2;
    item.gameName = 'baccarat';
    item.messages = { message: 'um message' };

    await model.insertMany([item]);
};

const initExchangeRates = async (moduleFixture: TestingModule) => {
    const model = moduleFixture.get(getModelToken('ExchangeRates')) as Model<ExchangeRatesDocument>;

    // Clear
    await model.deleteMany({});

    // Insert
    const item = new ExchangeRates();
    item.exId = 12;
    item.time = new Date();
    item.source = 'OW';
    item.code = {
        AUD: 0.7,
        CAD: 0.1282311001,
    };

    await model.insertMany([item]);
};
