const WebSocket = require('ws');
const msgpack = require('msgpack-lite');
const { decode, encode } = msgpack;

class Server {
	constructor() {
		this.ws = null;
	}

	connect() {
		this.ws = new WebSocket(`wss://social.krunker.io:8008/`);
		this.ws.binaryType = 'arraybuffer';
	}

	closeSocket() {
		if (this.ws && this.ws.readyState == 1) {
			this.ws.close();
			this.ws = null;
		}
	}

	getProfile(user) {
		this.connect();
		this.ws.onopen = () => this.ws.send(encode(['r', ['profile', user, '', null]]));
	}
}

class KrunkerJS extends Server {
	constructor() {
		super();
	}

	getUser(user) {
		return new Promise((resolve, reject) => {
			if (!user) return resolve(new Error('You must supply a username'));
			if (typeof user !== 'string') return resolve(new TypeError('Username must be a string'));

			try {
				this.getProfile(user);
				this.ws.onmessage = buf => {
					const data = decode(new Uint8Array(buf.data))[1][2];
					this.closeSocket();
					if (!data) return resolve(new Error('User not found'));
					return resolve(data);
				};
			} catch (err) {
				return reject(err);
			}

			return undefined;
		});
	}

	getLevel(data) {
		if (!data || !data.player_score) return new Error('You must supply data fetched from user');
		const score = data.player_score;
		return Math.max(1, Math.floor(0.03 * Math.sqrt(score)));
	}

	getPlayTime(data) {
		if (!data || !data.player_timeplayed) return new Error('You must supply data fetched from user');
		const time = data.player_timeplayed;
		let days, hours, minutes;
		minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
		hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
		days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
		let str = '';
		days ? (str += `${days}d `) : '';
		hours ? (str += `${hours}h `) : '';
		minutes ? (str += `${minutes}m`) : '';
		return str;
	}

	getKDR(data) {
		if (!data || !data.player_kills || !data.player_deaths) return new Error('You must supply data fetched from user');
		const KDR = data.player_kills / data.player_deaths || 0;
		return KDR.toFixed(2);
	}

	getWL(data) {
		if (!data || !data.player_wins || !data.player_games_played) return new Error('You must supply data fetched from user');
		const WL = data.player_wins / data.player_games_played || 0;
		return WL.toFixed(2);
	}

	getSPK(data) {
		if (!data || !data.player_score || !data.player_kills) return new Error('You must supply data fetched from user');
		const SPK = data.player_score / data.player_kills || 0;
		return SPK.toFixed(2);
	}
}

module.exports = KrunkerJS;
