import { Result } from '../../common/models/result';
import { UserInfos } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class BotsResponse extends Result<UserInfos[]> {
    @ApiProperty({ type: [UserInfos] })
    data: UserInfos[];
}
