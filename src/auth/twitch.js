const express = require('express');
const axios = require('axios').default;

const config = require('../../config');
const userModel = require('../database/models/user');
const channelModel = require('../database/models/channel');
const twitchAPI = require('../lib/twitch-api');

const redirect_uri = 'https://skulledbottwitch.up.railway.app/auth/twitch/callback';
const twitchRouter = express.Router();


const authBaseUrl = 'https://id.twitch.tv/oauth2';
const twitchAuthApi = axios.create({
	baseURL: authBaseUrl
});



// console.log(redirect_uri);
twitchRouter.get('/', (req, res) => {
	/* const BOTqs = new URLSearchParams({
		client_id: config.TWITCH_CLIENT_ID,
		redirect_uri,
		response_type: 'code',
		scope: 'chat:edit chat:read moderator:manage:banned_users moderator:read:blocked_terms moderator:manage:blocked_terms moderator:manage:automod moderator:read:automod_settings moderator:manage:automod_settings moderator:read:chat_settings moderator:manage:chat_settings channel:moderate'
	}); */
	const qs = new URLSearchParams({
		client_id: config.TWITCH_CLIENT_ID,
		redirect_uri,
		response_type: 'code',
		scope: 'chat:edit chat:read bits:read clips:edit user:edit user:edit:follows user:manage:blocked_users user:read:blocked_users user:read:broadcast user:read:email user:read:follows user:read:subscriptions moderation:read channel:moderate channel:manage:broadcast channel:manage:polls channel:manage:predictions channel:manage:redemptions channel:manage:schedule channel:manage:videos channel:read:editors channel:read:goals channel:read:hype_train channel:read:polls channel:read:predictions channel:read:redemptions channel:read:subscriptions moderator:manage:banned_users moderator:read:blocked_terms moderator:manage:blocked_terms moderator:manage:automod moderator:read:automod_settings moderator:manage:automod_settings moderator:read:chat_settings moderator:manage:chat_settings user:edit:broadcast'
	});
	const redirect_url = `${authBaseUrl}/authorize?${qs}`;
	res.redirect(redirect_url);
});

twitchRouter.get('/callback', async (req, res) => {
	const { code } = req.query;
	const qs = new URLSearchParams({
		client_id: config.TWITCH_CLIENT_ID,
		client_secret: config.TWITCH_CLIENT_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri
	});
	try {
		const { data: { access_token: token, refresh_token } } = await twitchAuthApi.post(`/token?${qs}`);
		const { id: twitchId, login: name } = await twitchAPI.getUser({ token });
		// console.log('UserToken: ' + token);
		const options = {
			new: true,
			upsert: true
		};
		const [user, channel] = await Promise.all([
			await userModel.findOneAndUpdate({ twitchId }, { twitchId, token, refresh_token }, options),
			await channelModel.findOneAndUpdate({ twitchId }, { twitchId, name }, options)
		]);
		res.json({ user, channel });
	} catch (error) {
		res.json({
			message: error.message,
			body: error.response ? error.response.data : error
		});
	}
});

module.exports = twitchRouter;