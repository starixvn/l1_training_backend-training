import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
    @Get()
    simpleTest(): string {
        return 'Simple test works!';
    }

    @Get('basic')
    basicTest(): any {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Basic test endpoint'
        };
    }
}
