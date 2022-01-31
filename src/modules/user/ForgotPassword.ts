import { forgotPasswordPrefix } from './../../constants/redisPrefixes';
import { sendEmail } from './../../utils/sendEmail';
import { Arg, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { v4 as uuid } from 'uuid';

@Resolver(User)
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User does not exist');
    }

    const token = uuid();
    await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24); // expires in 1 day

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
