import { AccountExistsError } from '../../common/errors';
import { BaseRepository } from '../base';
import { CreatePlayerDTO, IPlayer } from './player.model';
import PlayerSchema from './player.schema';

class PlayerRepository extends BaseRepository<IPlayer> {
  constructor() {
    super('Player', PlayerSchema);
  }

  /**
   * Creates an account for a user
   * @param body Body for creating a user
   * @param referrer User's referrer
   */
  async createAccount(body: CreatePlayerDTO) {
    await this.isEmailUsed(body.email);

    return this.create(body);
  }

  /**
   * Checks and throws an error if a particular email address is already tied to a different user account
   */
  async isEmailUsed(email: string) {
    const user = await this.model.exists({ email });
    if (user) throw new AccountExistsError();
  }
}

export const PlayerRepo = new PlayerRepository();
