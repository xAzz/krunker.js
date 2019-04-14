const WebSocket = require('ws');
const { encode } = require('msgpack-lite');

class Server {
	constructor() {
		this.ws = null;
	}

	connect() {
		this.ws = new WebSocket('wss://krunker_social.krunker.io:443/');
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

module.exports = Server;
