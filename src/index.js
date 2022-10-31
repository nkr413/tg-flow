const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require('fs')


// ------------------------------------


class Main {
	api_id;
	api_hash;
	session
	saved_session;

	constructor() {}

	init() {
		this.api_id = 0;
		this.api_hash = "";
		this.session = new StringSession(this.get_session("session.txt"));
	}

	get_session(path) {
		return fs.readFileSync(path, 'utf8').replace(/^"(.*)"$/, '$1');
	}

	get_data(path) {
		try {
			let rawdata = fs.readFileSync(path, 'utf8');
			return JSON.parse(rawdata);
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	store_data(data, path) {
		try {
			fs.writeFileSync(path, JSON.stringify(data));
		} catch (err) {
			console.error(err);
		}
	}

	sort_data(data, path) {
		let newbase = [];
		try {
			data["chats"].forEach((item) => {
				if (item["className"] == "Channel") newbase.push(item);
			})
			storeData(newbase, "base.json");
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	async old_start() {
		console.log("Loading interactive example...");
		const client = new TelegramClient(new StringSession(), this.api_id, this.api_hash, {connectionRetries: 5,});
		await client.start({
			phoneNumber: async () => await input.text("number ?"),
			password: async () => await input.text("password?"),
			phoneCode: async () => await input.text("Code ?"),
			onError: (err) => console.log(err),
		});
		await client.connect();
		console.log("You should now be connected.");

		const result = await client.invoke(
			new Api.messages.GetAllChats({
				exceptIds: [BigInt("-4156887774564")],
			})
		);

		console.log(result);

		//storeData(client.session.save(), "session.txt");
		// storeData(result, "data.json");
		// let x = getData("data.json");
		//sortData(x, "base.json");
	}

	// START POINT
	async start() {
		console.log("Loading interactive example...");
		const client = new TelegramClient(this.session, this.api_id, this.api_hash, {connectionRetries: 5,});
		await client.connect();
		console.log("You should now be connected.");

		const result = await client.invoke(
			new Api.messages.GetAllChats({
				exceptIds: [BigInt("-4156887774564")],
			})
		);

		console.log(result);
	}
}

const main = new Main();
main.init();
main.start();




// await client.start({
// 	phoneNumber: async () => await input.text("number ?"),
// 	password: async () => await input.text("password?"),
// 	phoneCode: async () => await input.text("Code ?"),
// 	onError: (err) => console.log(err),
// });
//client.session.save();

// const exit = await client.invoke(new Api.auth.LogOut({}));
// console.log(exit);


//storeData(client.session.save(), "session.txt");
// storeData(result, "data.json");
// let x = getData("data.json");
//sortData(x, "base.json");
