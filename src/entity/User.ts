import { Field, ID, ObjectType, Root } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @BeforeInsert()
  setId() {
    this.id = uuid();
  }
}
