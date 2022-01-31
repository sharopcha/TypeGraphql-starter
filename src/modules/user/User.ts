import { MyContext } from './../../types/MyContext';
import { Query, Resolver, Ctx } from 'type-graphql';

import { User } from '../../entity/User';

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
