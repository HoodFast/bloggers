import { Session } from '../../domain/session.entity';

export type CreateSessionType = Omit<
  Session,
  | 'id'
  | 'user'
  | 'hasId'
  | 'save'
  | 'remove'
  | 'softRemove'
  | 'recover'
  | 'reload'
>;
