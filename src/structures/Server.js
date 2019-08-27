const WebSocket = require('ws');
const { encode } = require('msgpack-lite');

class Server {
	constructor() {
		this.url = 'wss://krunker_social.krunker.io/ws';
		this.ws = null;
	}

	connect() {
		this.ws = new WebSocket(this.url);
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
		this.ws.onopen = () => this.ws.send(encode(['r', ['profile', user, '000000', null]]).buffer);
	}
}

module.exports = Server;
