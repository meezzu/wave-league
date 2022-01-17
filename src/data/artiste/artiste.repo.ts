import { BaseRepository } from "data/base";
import { IArtiste } from "./artiste.model";
import ArtisteSchema from "./artiste.schema";

class ArtisteRepository extends BaseRepository<IArtiste> {
    constructor() {
        super ('Artiste', ArtisteSchema)
    }
}

export const ArtisteRepo = new ArtisteRepository();