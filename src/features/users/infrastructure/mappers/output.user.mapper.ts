import { OutputUsersType } from '../../api/output/user.output';
import { User } from '../../domain/user.entity';

export const outputUserMapper = (data: User): OutputUsersType => {
  return {
    id: data.id,
    login: data.login,
    email: data.email,
    createdAt: data.createdAt.toISOString(),
  };
};
