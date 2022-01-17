import { BaseRepository } from '../base';
import { IPlayer } from './player.model';
import PlayerSchema from './player.schema';

class PlayerRepository extends BaseRepository<IPlayer> {
    constructor () {
        super ('Player', PlayerSchema)
    }
}

export const PlayerRepo = new PlayerRepository();