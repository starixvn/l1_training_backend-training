import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupDatabase } from '../_stubs/setup-database';
import { getBearerToken } from '../_stubs/helper';
import { Result } from 'src/common/models/result';
import { SettingForNewRound } from '../../../src/aggregation/models/settings-for-new-round';

jest.setTimeout(10000);
describe('Aggregation', () => {
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

    it('/aggregation/get-setting-for-new-round (GET)', async () => {
        // Act
        const token = await getBearerToken();
        const result = await request(app.getHttpServer())
            .get('/aggregation/get-setting-for-new-round?gameId=12')
            .set('Authorization', token);

        // Assert
        const model = JSON.parse(result.text) as Result<SettingForNewRound>;
        expect(result.status).toBe(200);
        expect(model.data.currencyGroupGames.length).toBe(1);
        expect(model.data.currencyGroups.length).toBe(1);
        expect(model.data.partnerGameSiteExclusions.length).toBe(1);
        expect(model.data.currencies.length).toBe(1);
    });
});
