import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User does not exist');
    }

    const valid = bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid credentials');
    }

    console.log(user);

    if (!user.confirmed) {
      throw new Error('Please confirm your email');
    }

    ctx.req.session.userId = user.id;

    console.log(ctx.req.session!.userId);

    return user;
  }
}
