import * as uuid from 'uuid/v4';

import IMatchmaker from "./Matchmaker";
import { Tournament } from "../Tournament";
import { Player } from "../../Player";
import { MatchOptions, Match } from "../match/Match";
import { MatchRunner } from "../match/MatchRunner";

/**
 * FreeForAll is a strategy where only one round is played, in which every player
 * plays against every other player in the tournament.
 *
 * The winner will be the player that has won the most games.
 *
 * In case of a tie the tied players will play against each other once more.
 */
export default class FreeForAllMatchmaker implements IMatchmaker {

    private maxMatches: number;
    private finished: boolean;
    private tournamentStats: Tournament;
    private index: number = 0;

    constructor(private players: Player[], private options: MatchOptions) {
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public updateStats(tournamentStats: Tournament) {
        this.tournamentStats = tournamentStats;
    }

    public getRemainingMatches(): Match[] {
        if (this.index >= this.players.length) {
            return [];
        }

        const match: Match[] = [];
        const matches = this.players.map((playerA, $index) => {
            if (this.index === $index) { return []; }
            return [this.players[this.index]].filter(playerB => {
                    return !(this.tournamentStats.matches.find(eachMatch =>
                        eachMatch.players[0] === playerA && eachMatch.players[1] === playerB ||
                        eachMatch.players[1] === playerA && eachMatch.players[0] === playerB,
                    ));
                },
            ).map(playerB => {
                    const newMatch: Match = {
                        matchID: uuid(),
                        players: [playerA, playerB],
                        games: [],
                        state: 'upcoming',
                    };
                    return newMatch;
                },
            );
        }).reduce((result, current, idx) => result.concat(current), []);

        ++this.index;
        this.finished = this.index >= this.players.length;

        return matches;
    }

    public getRanking(): string[] {
        const playerStats: any = {};
        this.tournamentStats.matches.forEach(match => {
            if (!playerStats[match.players[0]]) {
                playerStats[match.players[0]] = 0;
            }
            if (!playerStats[match.players[1]]) {
                playerStats[match.players[1]] = 0;
            }
            // TODO Create stat calculator for matches
            // const p0wins = match.stats.wins[0];
            // const p1wins = match.stats.wins[1];
            // if (p0wins === p1wins) {
            //     return;
            // }
            // if (p0wins > p1wins) {
            //     playerStats[match.players[0]]++;
            // }
            // if (p1wins > p0wins) {
            //     playerStats[match.players[1]]++;
            // }
        });
        return Object.keys(playerStats).map(token => ({
            gamesWon: playerStats[token],
            player: token,
        })).sort(
            (a: any, b: any) => b.gamesWon - a.gamesWon,
        ).map(playerRank => playerRank.player,
        );
    }
}