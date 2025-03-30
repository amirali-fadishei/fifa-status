"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersService = void 0;
const fs = require("fs");
const path = require("path");
const csv = require("@fast-csv/parse");
const common_1 = require("@nestjs/common");
const Player_1 = require("../core/models/Player");
let PlayersService = class PlayersService {
    constructor() {
        this.cachePlayers = {};
        this.cacheNationality = new Set();
        this.cachePosition = new Set();
    }
    readFromCSV() {
        return new Promise((resolve, reject) => {
            const data = [];
            fs.createReadStream(path.resolve(__dirname, '..', 'core', 'data', 'players.csv'))
                .pipe(csv.parse({ headers: true, maxRows: 80 }))
                .on('error', reject)
                .on('data', (row) => data.push({
                id: row.sofifa_id,
                shortName: row.short_name,
                longName: row.long_name,
                clubName: row.club_name,
                height: row.height_cm,
                wage: row.wage_eur,
                leagueName: row.league_name,
                leagueRank: row.league_rank,
                url: row.player_url,
                value: row.value_eur,
                weight: row.weight_kg,
                age: row.age,
                dob: row.dob,
                nationality: row.nationality,
                overall: row.overall,
                potential: row.potential,
                positions: row.player_positions.split(', '),
                imageUrl: `public/images/players/${row.sofifa_id}.png`,
            }))
                .on('end', () => {
                resolve(data);
            });
        });
    }
    async getPlayers() {
        const cache = Object.values(this.cachePlayers);
        if (cache.length) {
            cache.sort((a, b) => (b.overall >= a.overall ? 1 : -1));
            return cache;
        }
        const data = await this.readFromCSV();
        data.forEach((el) => {
            this.cachePlayers[el.id] = el;
            el.positions.forEach((elz) => {
                this.cachePosition.add(elz);
            });
            this.cacheNationality.add(el.nationality);
        });
        return data;
    }
    async getPositions() {
        if (this.cachePosition.size) {
            return [...this.cachePosition];
        }
        const data = await this.readFromCSV();
        data.forEach((el) => {
            this.cachePlayers[el.id] = el;
            el.positions.forEach((elz) => {
                this.cachePosition.add(elz);
            });
            this.cacheNationality.add(el.nationality);
        });
        return [...this.cachePosition];
    }
    async getNationality() {
        if (this.cacheNationality.size) {
            return [...this.cacheNationality];
        }
        const data = await this.readFromCSV();
        data.forEach((el) => {
            this.cachePlayers[el.id] = el;
            el.positions.forEach((elz) => {
                this.cacheNationality.add(elz);
            });
            this.cacheNationality.add(el.nationality);
        });
        return [...this.cacheNationality];
    }
};
PlayersService = __decorate([
    common_1.Injectable()
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map