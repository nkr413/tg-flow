const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require('fs')

// ID, HASH, SESSION
const apiId = 0;
const apiHash = "";
const session = new StringSession("");


// ------------------------------------


const storeData = (data, path) => {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (err) {
		console.error(err);
	}
}

(async () => {
	console.log("Loading interactive example...");
	const client = new TelegramClient(session, apiId, apiHash, {
		connectionRetries: 5,
	});
	await client.start({
		phoneNumber: async () => await input.text("number ?"),
		password: async () => await input.text("password?"),
		phoneCode: async () => await input.text("Code ?"),
		onError: (err) => console.log(err),
	});
	console.log("You should now be connected.");
	console.log(client.session.save()); // Save this string to avoid logging in again
	await client.sendMessage("me", { message: "Hello!" });

	const result = await client.invoke(
    new Api.messages.GetAllChats({
      exceptIds: [BigInt("-4156887774564")],
    })
  );

	storeData(result, "data.json");

	const exit = await client.invoke(new Api.auth.LogOut({}));
  console.log(exit);
})();