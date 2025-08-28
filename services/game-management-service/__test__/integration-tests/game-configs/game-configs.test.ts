import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupDatabase } from '../_stubs/setup-database';
import { GameConfigs, GameConfigsDocument } from 'src/game-configs/schemas';
import { getBearerToken } from '../_stubs/helper';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Result } from 'src/common/models/result';

jest.setTimeout(10000);
describe('Game Configs', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
        await setupDatabase(moduleFixture);
    });

    it('/game-configs (GET)', async () => {
        // Act
        const token = await getBearerToken();
        const result = await request(app.getHttpServer()).get('/game-configs?gameName=baccarat').set('Authorization', token);

        // Assert
        const model = JSON.parse(result.text) as Result<GameConfigs>;
        expect(result.status).toBe(200);
        expect(model.data.maxbet).toBe(10);
    });

    it('/game-configs/exchange-reload (POST)', async () => {
        // Act
        const gameConfigsModel = moduleFixture.get(getModelToken('GameConfigs')) as Model<GameConfigsDocument>;
        const oldData = await gameConfigsModel.findOne({ name: 'baccarat' }).lean().exec();

        const token = await getBearerToken();
        const result = await request(app.getHttpServer())
            .post('/game-configs/exchange-reload')
            .send({ gameName: 'baccarat', exchangeReload: true })
            .set('Authorization', token);

        // Assert
        const newData = await gameConfigsModel.findOne({ name: 'baccarat' }).lean().exec();
        expect(oldData.exchangeReload).toBe(false);
        expect(newData.exchangeReload).toBe(true);
        expect((JSON.parse(result.text) as Result<any>).errorCode).toBe(0);
    });

    it('/game-configs/disabled-round (POST)', async () => {
        // Act
        const gameConfigsModel = moduleFixture.get(getModelToken('GameConfigs')) as Model<GameConfigsDocument>;
        const oldData = await gameConfigsModel.findOne({ name: 'baccarat' }).lean().exec();

        const token = await getBearerToken();
        const result = await request(app.getHttpServer())
            .post('/game-configs/disabled-round')
            .send({ gameName: 'baccarat', roundId: 123 })
            .set('Authorization', token);

        // Assert
        const newData = await gameConfigsModel.findOne({ name: 'baccarat' }).lean().exec();
        expect(oldData.disabledround).toBe(1);
        expect(newData.disabledround).toBe(123);
        expect((JSON.parse(result.text) as Result<any>).errorCode).toBe(0);
    });
});
