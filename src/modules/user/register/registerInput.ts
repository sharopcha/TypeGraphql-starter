import { IsEmail, Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { isEmailAlreadyExist } from './isEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 30)
  firstName: string;

  @Field()
  @Length(1, 30)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyExist({ message: 'The email you inserted already in use' })
  email: string;

  @Field()
  password: string;
}
