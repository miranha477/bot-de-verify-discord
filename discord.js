const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.on("ready", () => {
  client.user.setActivity("🛡️ Verificação ativa", { type: 0 }); // Playing
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.login(process.env.TOKEN);

module.exports = client;
