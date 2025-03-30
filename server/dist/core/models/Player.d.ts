export interface IPlayerCSV {
    sofifa_id: number;
    player_url: string;
    short_name: string;
    long_name: string;
    age: number;
    dob: string;
    height_cm: number;
    weight_kg: number;
    nationality: string;
    club_name: string;
    league_name: string;
    league_rank: number;
    overall: number;
    potential: number;
    value_eur: number;
    wage_eur: number;
    player_positions: string;
}
export declare class IPlayer {
    id: number;
    url: string;
    shortName: string;
    longName: string;
    age: number;
    dob: string;
    height: number;
    weight: number;
    nationality: string;
    clubName: string;
    leagueName: string;
    leagueRank: number;
    overall: number;
    potential: number;
    value: number;
    wage: number;
    positions: string[];
    imageUrl: string;
}
