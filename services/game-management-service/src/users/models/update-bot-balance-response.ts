import { Result } from '../../common/models/result';
import { UserInfos } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBotsBalanceResponse extends Result<UserInfos[]> {
    @ApiProperty({ type: [UserInfos] })
    data: UserInfos[];
}
