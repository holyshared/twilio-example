import { Twilio } from 'twilio';

const main = async () => {
  const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  const user = await client.chat.services(process.env.TWILIO_SERVICE_SID).users("auth0|60c325974de8ad0069c3cbbf").fetch();

  const createRemoveTasks = () => {
    return new Promise<(() => Promise<void>)[]>((resolve) => {
      let tasks : (() => Promise<void>)[] = [];

      user.userChannels().each({
        callback: (channel, done) => {
          if (channel.channelSid === "CH2f8a71b897ab43419f32f251408d6431") {
            return;
          }
          tasks.push(() => channel.remove().then(() => console.log("leave channel")));
        },
        done: () => {
          resolve(tasks);
        }
      });
    })
  };

  let tasks  = await createRemoveTasks();
  console.log(tasks.length);

  while (tasks.length > 0) {
    const items = tasks.splice(0, 50);
    await Promise.all(items.map(item => item()));
  }

}

main().then(() => console.log("done"))
  .catch(err => console.log(err));
