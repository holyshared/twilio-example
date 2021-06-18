import { Twilio } from 'twilio';

const main = async () => {
  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  const channel = await client.chat.services(process.env.TWILIO_SERVICE_SID).channels(process.env.TWILIO_CHANNEL).fetch();
  await channel.messages().create({
    from: "auth0|60c325974de8ad0069c3cbbf",
    body: "message 1",
    xTwilioWebhookEnabled: "true",
    attributes: JSON.stringify({
      muteNotification: true
    })
  });
}

main().then(() => console.log("done"))
  .catch(err => console.log(err));
