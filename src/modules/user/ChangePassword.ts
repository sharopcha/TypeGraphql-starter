import bcrypt from 'bcryptjs';
import { forgotPasswordPrefix } from './../../constants/redisPrefixes';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver(User)
export class ChangePassword {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('password') password: string,
    @Arg('token') token: string
  ): Promise<User> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      throw new Error('Bad token');
    }

    const user = await User.findOne(userId);

    if (!user) {
      throw new Error('Something went wrong');
    }

    redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    return user;
  }
}
