import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        try {
            return `Hello from ${process.env.ENV || 'unknown'} - ${process.env.SYSTEM_TYPE || 'unknown'}`;
        } catch (error) {
            console.error('Error in getHello:', error);
            return 'Hello World - Basic Response';
        }
    }
}
