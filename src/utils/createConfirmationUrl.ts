import { confirmationPrefix } from './../constants/redisPrefixes';
import { v4 as uuid } from 'uuid';
import { redis } from '../redis';

export const createConfirmationUrl = async (userId: string) => {
  const token = uuid();

  redis.set(confirmationPrefix + token, userId, 'ex', 60 * 60 * 24); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
