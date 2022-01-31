import { createConfirmationUrl } from './../../utils/createConfirmationUrl';
import { sendEmail } from './../../utils/sendEmail';
import { isAuth } from './../../middleware/isAuth';
import { RegisterInput } from './register/registerInput';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  // @Authorized()
  @UseMiddleware(isAuth) // we can pass as many middleware functions as possible
  @Query(() => String)
  async hello() {
    return 'Hello world!';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}
