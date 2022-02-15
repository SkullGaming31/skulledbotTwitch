const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const helmet = require('helmet');
const volleyball = require('volleyball');

const config = require('../config');
require('./twitchChat');

// Behind every cloud is a ray of sunshine waiting to be revealed. Shine your light on those that need guidance in the darkness
async function run () {
	const Port = config.PORT;
	const app = express();
	
	const baseUrl = 'https://id.twitch.tv/oauth2';
	const authApi = axios.create({
		baseURL: baseUrl,
	});
	
	app.use(cors());
	app.use(helmet());
	app.use(volleyball);
	

	app.get('/', (req, res) => {
		res.sendFile('src/assets/index.html', { root: '.' });
	});

	app.use('/auth/twitch', require('./auth/twitch'));
	

	// app.get('/auth/discordAuth', async (req, res) => {
	// 	res.json({
	// 		message: 'Hello Discord Auth has not been implemented yet'
	// 	});
	// });
		
		


	app.listen(Port || 8081, () => { console.log(`Server started on http://localhost:${Port}`); });
}
run();

// bot scopes- chat:edit chat:read 

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