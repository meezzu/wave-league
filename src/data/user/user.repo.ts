import { AccountExistsError } from '../../common/errors';
import { BaseRepository, Repository } from '../base';
import { SignupDTO, IUser } from './user.model';
import UserSchema from './user.schema';
import bcrypt from 'bcrypt';
import env from '../../common/config/env';

// the interface needs to extend the Repository class
export interface IUserRepository extends Repository<IUser> {
  getAccount(id: string): Promise<IUser>;
  createAccount(body: SignupDTO): Promise<IUser>;
  isEmailUsed(phone_number: string): Promise<void>;
  isPhoneNumberUsed(phone_number: string): Promise<void>;
  updatePassword: (id: string, plainText: string) => Promise<IUser>;
  isPasswordValid: (id: string, plainText: string) => Promise<Boolean>;
}

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super('User', UserSchema);
  }

  /**
   * Creates an account for a user
   * @param body Body for creating a user
   * @param referrer User's referrer
   */
  async createAccount(body: SignupDTO) {
    await this.isEmailUsed(body.email);
    await this.isPhoneNumberUsed(body.phone_number);

    return this.create(body);
  }

  getAccount(id: string): Promise<IUser> {
    return this.byID(id);
  }

  /**
   * Checks and throws an error if a particular phone number is already tied to a user account
   */
  async isPhoneNumberUsed(phone_number: string) {
    const user = await this.model.exists({ phone_number });
    if (user) throw new AccountExistsError();
  }

  /**
   * Checks and throws an error if a particular email address is already tied to a different user account
   */
  async isEmailUsed(email: string) {
    const user = await this.model.exists({ email });
    if (user) throw new AccountExistsError();
  }

  async isPasswordValid(id: string, plainText: string) {
    const user = await this.getAccount(id);
    return await bcrypt.compare(plainText, user.password);
  }

  async updatePassword(id: string, plainText: string) {
    const password = await bcrypt.hash(plainText, env.salt_rounds);
    return this.updateWithOperators(id, { $set: { password } });
  }
}

export const userRepo = new UserRepository();
