declare module 'krunker.js' {
    export default class {
        public getUser(username: string): Promise<Stats>;
        public getLevel(data: Stats): number;
        public getPlayTime(data: Stats): string;
        public getKDR(data: Stats): string;
        public getWL(data: Stats): string;
        public getSimplified(data: Stats): SimplifiedStats;
    }

    interface Stats {
        player_name: string;
        player_id: number;
        player_kills: number;
        player_wins: number;
        player_games_played: number;
        player_deaths: number;
        player_timeplayed: number;
        player_funds: number;
        player_score: number;
        player_featured: number;
        player_clan: string;
        player_hack: number;
        player_following: number;
        player_followed: number;
        player_stats: {
            c: number;
            s: number;
            h: number;
        };
        player_datenew: string;
        player_elo: number;
        simplified: SimplifiedStats;
    }

    interface SimplifiedStats {
        name: string;
        id: number;
        score: number;
        level: number;
        kills: number;
        deaths: number;
        kdr: string;
        spk: string;
        totalGamesPlayed: number;
        wins: number;
        loses: number;
        wl: string;
        playTime: string;
        krunkies: number;
        clan: string;
        featured: string;
        hacker: string;
    }
}