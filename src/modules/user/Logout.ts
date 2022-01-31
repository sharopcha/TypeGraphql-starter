import { MyContext } from './../../types/MyContext';
import { Resolver, Mutation, Ctx } from 'type-graphql';

@Resolver()
export class LogOutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((res, rej) =>
      ctx.req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return rej(false);
        }

        ctx.res.clearCookie('qid');
        return res(true);
      })
    );
  }
}
