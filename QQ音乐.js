/**
 * MusicFree QQ音乐插件
 * API提供: https://api.xingzhige.com
 *
 * @author: Yingyya
 * @date: 2023-09-30 17:05
 */

const axios = require("axios");

function get(url, params) {
	return axios({
		url,
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		params
	});
}

async function search(name, page, type) {
	if (type === 'music') {
		try {
			const limit = 10;
			let response = await get('https://api.xingzhige.com/API/QQmusicVIP/', {
				page,
				limit,
				name
			});
			let {
				code, data: songs
			} = response.data;
			if (code === 0) {
				let data = songs.map(song => ({
					id: song.mid,
					title: song.songname,
					artist: song.name,
					artwork: song.cover,
					album: song.album
				}));
				let total = Math.ceil(response.headers.estimate_sum / limit);
				return {
					isEnd: page >= total,
					data
				};
			}
		} catch {
			console.error('请求出错拉!');
		}
	}
}

async function getMediaSource(music, br) {
	try {
		const BREmun = {
			super: 14,
			high: 11,
			standard: 8,
			low: 6
		};
		let {
			code, data
		} = (await get('https://api.xingzhige.com/API/QQmusicVIP/', {
			mid: music.id,
			br: BREmun[br]
		})).data;
		console.log(data)
		if (code === 0) {
			return {
				url: data.src
			};
		}
	} catch {
		console.error('请求出错拉!');
	}
}

async function getLyric(music) {
	try {
		let {
			code, data
		} = (await get('https://api.xingzhige.com/API/QQmusicVIP/', {
			mid: music.id,
			format: 'lrc'
		})).data;
		console.log(data)
		if (code === 0) {
			return {
				rawLrc: data.lrc.content
			};
		}
	} catch {
		console.error('请求出错拉!');
	}
}


module.exports = {
	platform: 'QQ音乐',
	version: '1.0.0',
	appVersion: '>0.0',
	defaultSearchType: 'music',
	srcUrl: 'https://github.com/Yingyya/MusicFreePlugin/blob/main/QQ音乐.js'
	search,
	getMediaSource,
	getLyric
};