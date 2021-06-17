import express, { Request, Response } from "express";
import { urlencoded, json } from "body-parser";
import { jwt } from 'twilio';

const ChatGrant = jwt.AccessToken.ChatGrant;

const app = express();

app.use(
  express.static("public", {
    maxAge: 60,
  }),
);

app.use(urlencoded({ extended: false }))
app.use(json())

app.post("/token", (req: Request, res: Response) => {
  const chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID,
    pushCredentialSid: process.env.TWILIO_PUSH_CREDENTIAL_SID,
  })

  const token = new jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: process.env.TWILIO_IDENTITY }
  )

  token.addGrant(chatGrant)

  res.json({ jwt: token.toJwt() })
})

app.post("/pre-hook", (req: Request, res: Response) => {
  console.log("pre-hook ------")
  console.log(req.headers)
  console.log(req.body)
  res.status(200).end()
})

app.post("/post-hook", (req: Request, res: Response) => {
  console.log("post-hook ------")
  console.log(req.headers)
  console.log(req.body)
  res.status(200).end()
})

app.use((err, req: Request, res: Response, next) => {
  console.error(err.stack || err)

  res.status(500)
  res.send("Internal server error")
})

app.listen(process.env.PORT || 3000)
