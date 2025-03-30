import { IPlayer } from 'src/core/models/Player';
export declare class PlayersService {
    private cachePlayers;
    private cacheNationality;
    private cachePosition;
    private readFromCSV;
    getPlayers(): Promise<IPlayer[]>;
    getPositions(): Promise<string[]>;
    getNationality(): Promise<string[]>;
}
