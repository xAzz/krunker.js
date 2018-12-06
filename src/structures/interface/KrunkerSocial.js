const { decode } = require('msgpack-lite');
const { Error, TypeError } = require('../../errors');
const Server = require('../Server');

class KrunkerSocial extends Server {
	getUser(user) {
		return new Promise((resolve, reject) => {
			if (!user) return reject(new Error('MUST_SUPPLY', 'a username'));
			if (typeof user !== 'string') return reject(new TypeError('BAD_USERNAME_TYPE'));

			try {
				super.getProfile(user);
				this.ws.onmessage = buf => {
					const data = decode(new Uint8Array(buf.data))[1][2];
					super.closeSocket();
					if (!data) return reject(new Error('USER_NOT_FOUND'));
					data.simplified = this.getSimplified(data);
					return resolve(data);
				};
			} catch (err) {
				return reject(err);
			}

			return undefined;
		});
	}

	getLevel(data) {
		if (!data || typeof data !== 'object' || !data.player_score) return new Error('MUST_SUPPLY', 'data fetched from user');
		const score = data.player_score;
		return Math.max(1, Math.floor(0.03 * Math.sqrt(score)));
	}

	getPlayTime(data) {
		if (!data || typeof data !== 'object' || !data.player_timeplayed) return new Error('MUST_SUPPLY', 'data fetched from user');
		const time = data.player_timeplayed;
		let str = '';
		const minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
		const hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
		const days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
		if (days) str += `${days}d `;
		if (hours) str += `${hours}h `;
		if (minutes) str += `${minutes}m`;
		return str;
	}

	getKDR(data) {
		if (!data || typeof data !== 'object' || !data.player_kills || !data.player_deaths) return new Error('MUST_SUPPLY', 'data fetched from user');
		const KDR = data.player_kills / data.player_deaths || 0;
		return KDR.toFixed(2);
	}

	getWL(data) {
		if (!data || typeof data !== 'object' || !data.player_wins || !data.player_games_played) return new Error('MUST_SUPPLY', 'data fetched from user');
		const WL = data.player_wins / data.player_games_played || 0;
		return WL.toFixed(2);
	}

	getSPK(data) {
		if (!data || typeof data !== 'object' || !data.player_score || !data.player_kills) return new Error('MUST_SUPPLY', 'data fetched from user');
		const SPK = data.player_score / data.player_kills || 0;
		return SPK.toFixed(2);
	}

	getSimplified(data) {
		return {
			name: data.player_name,
			id: data.player_id,
			score: data.player_score,
			level: this.getLevel(data),
			kills: data.player_kills,
			deaths: data.player_deaths,
			kdr: this.getKDR(data),
			spk: this.getSPK(data),
			totalGamesPlayed: data.player_games_played,
			wins: data.player_wins,
			loses: data.player_games_played - data.player_wins,
			wl: this.getWL(data),
			playTime: this.getPlayTime(data),
			krunkies: data.player_funds,
			clan: data.player_clan ? data.player_clan : 'No Clan',
			featured: data.player_featured ? data.player_featured : 'No',
			hacker: data.player_hack ? data.player_hack : 'No'
		};
	}
}

module.exports = KrunkerSocial;