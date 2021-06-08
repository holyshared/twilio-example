import Chat from "twilio-chat";
import axios from "axios";

const main = async () => {
  const res = await axios.post("/token");
  const client = await Chat.create(res.data.jwt);
  const channels = await client.getUserChannelDescriptors();

  console.log(channels.items);

};

main().then(() => console.log("done")).catch(err => console.log(err));
