import { PlayersService } from './players.service';
export declare class PlayersController {
    private playersService;
    constructor(playersService: PlayersService);
    getPlayers(): Promise<{
        success: boolean;
        data: import("../core/models/Player").IPlayer[];
    }>;
    getPositions(): Promise<{
        success: boolean;
        data: string[];
    }>;
    getNationality(): Promise<{
        success: boolean;
        data: string[];
    }>;
}
