import { Player } from "../../Player";
import { Match } from "../match/Match";
import { Tournament } from "../Tournament";
export default interface IMatchMaker {
    isFinished(): boolean;
    updateStats(tournament: Tournament): Match[] | void;
    getRemainingMatches(tournament: Tournament): Match[];
    getRanking(tournament: Tournament): Player[];
}