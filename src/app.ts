import express from "express";
import { jwt } from 'twilio';

const ChatGrant = jwt.AccessToken.ChatGrant;

const app = express();

app.post("/token", (req, res) => {
  const chatGrant = new ChatGrant({
    serviceSid: process.env.SERVICE_SID,
  });

  const token = new jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: process.env.TWILIO_IDENTITY }
  );

  token.addGrant(chatGrant);

  res.json({ jwt: token.toJwt() });
});

app.listen(process.env.PORT);
