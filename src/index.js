const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const volleyball = require('volleyball');
const { Client, Intents } = require('discord.js');

require('./twitchChat');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const { PORT } = require('../config');

client.on('error', err => { console.log(err); });
process.on('unhandledRejection', (reason, p) => { console.log(reason, p); });
process.on('uncaughtException', (err, origin) => { console.log(err, origin); });
process.on('uncaughtExceptionMonitor', (err, origin) => { console.log(err, origin); });
process.on('multipleResolves', (type, promise, reason) => { console.log(type, promise, reason); });
process.on('warning', (warn) => { console.log(warn); });

async function run() {
	const Port = PORT;
	const app = express();


	app.use(cors());
	app.use(helmet());
	app.use(volleyball);

	app.get('/', (req, res) => {
		res.sendFile('src/assets/index.html', { root: '.' });
	});
	app.get('/about', (req, res) => {
		res.sendFile('src/assets/about.html', { root: '.' });
	});

	app.use('/auth/twitch', require('./auth/twitch'));

	app.listen(Port || 8889, () => { console.log(`Server started on http://localhost:${Port}`); });
}
run();

// bot scopes- chat:edit chat:read moderation:read 

/*
USER SCOPES-
bits:read 
channel:edit:commercial 
channel:manage:broadcast 
channel:read:polls
channel:manage:polls
channel:manage:predictions
channel:read:predictions
channel:read:redemptions
channel:manage:redemptions
channel:manage:schedule
channel:read:editors
channel:read:goals
channel:read:hype_train
channel:read:subscriptions
channel_subscriptions
clips:edit
moderation:read
moderator:manage:automod
user:edit
user:edit:follows
user:manage:blocked_users
user:read:blocked_users
user:read:broadcast
user:read:email
user:read:follows
user:read:subscriptions
user:edit:broadcast
*/