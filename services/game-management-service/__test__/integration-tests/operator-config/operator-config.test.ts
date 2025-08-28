import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupDatabase } from '../_stubs/setup-database';
import { getBearerToken } from '../_stubs/helper';
import { OperatorConfig } from 'src/operator-configs/schemas';
import { Result } from 'src/common/models/result';

jest.setTimeout(10000);
describe('Operator Config', () => {
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

    it('/operator-config/game-site-exclusions (GET)', async () => {
        // Act
        const token = await getBearerToken();
        const result = await request(app.getHttpServer()).get('/operator-config/game-site-exclusions').set('Authorization', token);

        // Assert
        const model = JSON.parse(result.text) as Result<OperatorConfig[]>;
        expect(result.status).toBe(200);
        expect(model.data[0].value).toEqual([{ '10': ['site1'] }]);
    });
});
