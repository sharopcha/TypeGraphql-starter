import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver(User)
export class ConfirmUser {
  @Mutation(() => Boolean)
  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await User.update({ id: userId }, { confirmed: true });

    await redis.del(token);

    return true;
  }
}
