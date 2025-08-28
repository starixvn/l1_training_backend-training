import { ApiProperty } from '@nestjs/swagger';
import { Result } from '../../common/models/result';
import { OperatorConfig } from '../schemas';

export class OperatorConfigsResponse extends Result<OperatorConfig[]> {
    @ApiProperty({ type: [OperatorConfig] })
    data: OperatorConfig[];
}
