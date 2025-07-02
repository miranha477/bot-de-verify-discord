const router = require("express").Router();
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const client = require("../discord");
const fetch = require("node-fetch");
const enviarLogVerificacao = require("../utils/logWebhook");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
  scope: ["identify", "guilds.join"]
}, (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  return done(null, profile);
}));

router.get("/discord", passport.authenticate("discord"));

router.get("/discord/callback", passport.authenticate("discord", {
  failureRedirect: "/"
}), async (req, res) => {
  try {
    const { id, accessToken } = req.user;
    await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${process.env.TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ access_token: accessToken })
    });

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = await guild.members.fetch(id);
    await member.roles.add(process.env.CARGO_VERIFICADO);

    await enviarLogVerificacao(req.user);
    res.redirect("/success");
  } catch (err) {
    console.error("Erro ao adicionar usuário:", err);
    res.send("Erro ao verificar. Tente novamente.");
  }
});

module.exports = router;
