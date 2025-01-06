import axios from 'axios';
import * as cheerio from 'cheerio';

const { OpenAI } = require('openai')
const genai = new OpenAI({ apiKey: "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" });

const url = "https://scores24.live/en/soccer/2024-12-23";
const headers = {
	"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
	"accept-language": "en-US,en;q=0.9",
	"cache-control": "max-age=0",
	"cookie": "testValue=2; userOddFormat=EU; machineTimezone=GMT+10; s24-session=NBoddFWoMNCG1SgxGluXXzy2RiYC2TbFtZKN5KdP; _ga=GA1.1.639638814.1734728961; language=en; promo-proxy-2a34b=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoie1wiY2FtcGFpZ25zXCI6e1wiNlwiOjE3MzQ3Mjg5NjEsXCI0XCI6MTczNDgxNTQ5OCxcIjUwXCI6MTczNDcyOTAzNCxcIjUzXCI6MTczNDcyOTEyMSxcIjU0XCI6MTczNDgwNDY1OSxcIjFcIjoxNzM0ODA3NzExfSxcInRpbWVcIjoxNzM0ODE1NDk4LFwic3RyZWFtc1wiOntcIjY3OVwiOjE3MzQ4MTU0OTgsXCI4MjcyXCI6MTczNDcyOTAzNCxcIjk2OTFcIjoxNzM0NzI5MTIxLFwiOTc5NlwiOjE3MzQ4MDQ2NTksXCI2MDlcIjoxNzM0ODA3NzExfX0ifQ.ic9owIJp5HAfrtkMn1NtQGb9PoYZCNvOTKjkojKbcOw; _ga_ZPJ1YWQ2Z0=GS1.1.1734843592.4.1.1734843595.57.0.0; promo-proxy-_subid=1re9fc512evan9; promo-proxy-_token=uuid_1re9fc512evan9_1re9fc512evan96767afdcccca35.95424897; latestWidth=1920",
	"sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
	"sec-ch-ua-mobile": "?0",
	"sec-ch-ua-platform": '"Windows"',
	"sec-fetch-dest": "document",
	"sec-fetch-mode": "navigate",
	"sec-fetch-site": "same-origin",
	"sec-fetch-user": "?1",
	"upgrade-insecure-requests": "1",
	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
};

export class Score24 {
	public get_match_list = async (sport: string) => {
		const sporturl = `https://scores24.live/en/${sport}`;
		const list: any = [];
		try {
			const res = await axios.get(sporturl, { headers });
			if (res.status === 200) {
				const $ = cheerio.load(res.data);
				const rawlist = $('.hovxil');
				rawlist.each((index, match) => {
					const id = index + 1;
					const time = $(match).find('.jGwBLG').text().trim();
					const preTitle = $(match).find('.cBiFXI').children();
					const status = $(match).find('.dUdldj').text().trim();
					const matchlink = $(match).find('.cBiFXI').attr('href');
					let title = "";
					preTitle.each((index, element) => {
						title += $(element).text().trim();
						if (index === 0) title += " vs ";
					});
					list.push({ GameId: id, GameTitle: title, Time: time, Status: status, Link: matchlink });
				});
			} else {
				console.log(`Failed to retrieve data: ${res.status}`);
			}
		} catch (err: any) {
			console.error("Error during the request:", err.message);
		}
		return list;
	}
	public get_match_overview = async (matchlink: string) => {
		const matchurl = `https://scores24.live${matchlink}`;
		const info = [];
		try {
			const res = await axios.get(matchurl, { headers });
			if (res.status === 200) {
				const $ = cheerio.load(res.data);
				const rawInfo = $('.ftQcE');
				const tournament = $(rawInfo).find('.huCDaS').text().trim();
				const venue = $(rawInfo).find('.kZtEmN').text().trim();
				const rawScore = $('.kKVLXY');
				const team1 = "5 " + $(rawScore[1]).find('.kiLgeu').text();
				const team1wins = $(rawScore[1]).find('.bZQzlG').length;
				const team2 = "5 " + $(rawScore[2]).find('.kiLgeu').text();
				const team2wins = $(rawScore[2]).find('.bZQzlG').length;
				info.push({ Tournament: tournament, Venue: venue, Team1: team1, Team1Wins: team1wins, Team2: team2, Team2Wins: team2wins })
			} else {
				console.log(`Failed to retrieve data: ${res.status}`);
			}
		} catch (err: any) {
			console.error("Error during the request:", err.message);
		}
		return info;
	}
	public get_match_prediction = async (matchlink: string) => {
		const matchurl = `https://scores24.live${matchlink}-prediction`;
		const prediction = [];
		try {
			const res = await axios.get(matchurl, { headers });
			if (res.status === 200) {
				const $ = cheerio.load(res.data);
				const rawPrediction = $('.hSGGEC').text();
				prediction.push(rawPrediction);
			} else {
				console.log(`Failed to retrieve data: ${res.status}`);
			}
		} catch (err: any) {
			console.error("Error during the request:", err.message);
		}
		return prediction;
	}
	public get_ai_insight = async (prompt: string) => {
		try {
			const completion = await genai.chat.completions.create({
				model: "gpt-3.5-turbo", // Specify the model you want to use
				messages: [
					{ role: "system", content: "You are a helpful assistant for sports betting" },
					{ role: "user", content: prompt },
				],
			});
			// console.log(completion.choices[0].message.content); // Output the generated text
			return completion.choices[0].message.content;
		} catch (error) {
			console.error("Error generating text:", error);
		}
	}
	public get_match_trends = async (matchlink: string) => {
		const matchurl = `https://scores24.live${matchlink}#trends`;
		// const info = [];
		try {
			const res = await axios.get(matchurl, { headers });
			if (res.status === 200) {
				const $ = cheerio.load(res.data);
				const rawInfo = $('.ELurp');
				const children = $(rawInfo).children();
				const test = $(children[0]).find(".ggBZuE").text().trim();
				console.log(test);
			} else {
				console.log(`Failed to retrieve data: ${res.status}`);
			}
		} catch (err: any) {
			console.error("Error during the request:", err.message);
		}
		// return info;
	}
}
























































































































































































// const target_url = "https://scores24.live/en/soccer/2024-12-23";


// console.log(target_url);
