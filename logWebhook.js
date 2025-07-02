const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = async function enviarLogVerificacao(user) {
  const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

  const embed = new EmbedBuilder()
    .setTitle("✅ Usuário Verificado")
    .addFields(
      { name: "Usuário", value: `<@${user.id}> \`(${user.username}#${user.discriminator})\`` },
      { name: "ID", value: user.id },
      { name: "Verificação", value: "Automática via painel" }
    )
    .setColor("Green")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
    .setFooter({ text: "Sistema de Verificação", iconURL: "https://cdn-icons-png.flaticon.com/512/190/190411.png" })
    .setTimestamp();

  await webhook.send({ embeds: [embed] });
};
