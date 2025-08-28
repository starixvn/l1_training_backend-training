import { Result } from '../../common/models/result';
import { UserInfos } from '../schemas';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse extends Result<UserInfos> {
    @ApiProperty()
    data: UserInfos;
}
