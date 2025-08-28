import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupDatabase } from '../_stubs/setup-database';
import { getBearerToken } from '../_stubs/helper';
import { Notification } from 'src/notifications/schemas';
import { Result } from 'src/common/models/result';

jest.setTimeout(10000);
describe('Notification', () => {
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

    it('/notification/um-messages (GET)', async () => {
        // Act
        const token = await getBearerToken();
        const result = await request(app.getHttpServer()).get('/notification/um-messages?configName=baccarat').set('Authorization', token);

        // Assert
        const model = JSON.parse(result.text) as Result<object>;
        expect(result.status).toBe(200);
        expect(model.data).toEqual({ message: 'um message' });
    });
});
