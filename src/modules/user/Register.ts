import { RegisterInput } from './register/registerInput';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  @Authorized()
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

    return user;
  }
}
