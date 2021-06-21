import express, { Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
import { jwt } from 'twilio';
import { addIgnoreMessage } from './ignore-store';

interface PreHookBody {
  ChannelSid: string;
  ClientIdentity: string;
  RetryCount: string;
  EventType: 'onMessageSend';
  InstanceSid: string;
  Attributes: string;
  DateCreated: string;
  From: string;
  To: string;
  Body: string;
  AccountSid: string;
  Source: 'SDK' | 'API';
}

interface PostHookBody {
  ChannelSid: string;
  RetryCount: string;
  EventType: 'onMessageSend';
  InstanceSid: string;
  Attributes: string;
  DateCreated: string;
  Index: string;
  From: string;
  MessageSid: string;
  Body: string;
  AccountSid: string;
  Source: 'SDK' | 'API';
}

interface MessageAttributes {
  muteNotification?: boolean;
  save?: boolean;
}

const ChatGrant = jwt.AccessToken.ChatGrant;

const app = express();

app.use(
  express.static('public', {
    maxAge: 60,
  })
);

app.use(urlencoded({ extended: false }));
app.use(json());

app.post('/token', (req: Request, res: Response) => {
  const chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID,
    pushCredentialSid: process.env.TWILIO_PUSH_CREDENTIAL_SID,
  });

  const identity = req.body.identity || process.env.TWILIO_IDENTITY;

  const token = new jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity }
  );

  token.addGrant(chatGrant);

  res.json({ jwt: token.toJwt() });
});

app.post(
  '/pre-hook',
  (req: Request<{}, PreHookBody, PreHookBody>, res: Response) => {
    console.log('pre-hook ------');
    console.log(req.headers);
    console.log(req.body);

    const result: { mute_notification?: 'true' | 'false' } = {};

    if (req.body.EventType === 'onMessageSend') {
      const attributes = JSON.parse(req.body.Attributes) as MessageAttributes;
      Object.assign(result, {
        mute_notification: String(attributes.muteNotification),
      });
    }

    res.status(200).json(result);
  }
);

app.post(
  '/post-hook',
  async (req: Request<{}, PostHookBody, PostHookBody>, res: Response) => {
    console.log('post-hook ------');
    console.log(req.headers);
    console.log(req.body);

    if (req.body.EventType !== 'onMessageSend') {
      res.status(200).end();
    }

    const attributes = JSON.parse(req.body.Attributes) as MessageAttributes;
    if (!attributes.save) {
      res.status(200).end();
    }

    addIgnoreMessage(req.body.From, req.body.ChannelSid, req.body.Index)
      .then(() => {
        console.info("add ignore messages");
        res.status(200).end();
      })
      .catch((err: Error) => {
        console.error(err.stack);
        res.status(500).end();
      });
  }
);

app.use((err, req: Request, res: Response, next) => {
  console.error(err.stack || err);

  res.status(500);
  res.send('Internal server error');
});

app.listen(process.env.PORT || 3000);
