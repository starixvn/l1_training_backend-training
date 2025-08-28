import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupDatabase } from '../_stubs/setup-database';
import { getBearerToken } from '../_stubs/helper';
import { Promotion } from 'src/promotions/schemas';
import { Result } from 'src/common/models/result';
import { UpdateBalanceRequest } from 'src/users/models';
import { UserInfos } from 'src/users/schemas/user-infos.schema';

jest.setTimeout(10000);
describe('User', () => {
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

    it('/users/update-bots-balance (POST)', async () => {
        // Act
        const token = await getBearerToken();
        const payload = {
            bots: [
                { id: '1', deductionAmount: 20 },
                { id: '2', deductionAmount: 10 },
            ],
        };
        const result = await request(app.getHttpServer()).post('/users/update-bots-balance').send(payload).set('Authorization', token);

        // Assert
        const model = JSON.parse(result.text) as Result<UserInfos[]>;
        expect(result.status).toBe(201);
        expect(model.data.length).toBe(1);
        expect(model.data[0].red).toEqual(80);
    });
});
