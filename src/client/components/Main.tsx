import React, { useContext, useEffect, useState } from "react";
import { TwilioContext } from "./contexts/twilio";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { MessageField } from "./MessageField";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";
import { Loading } from "./Loading";

const MESSAGE_COUNT = 10;

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [currentChannels, setCurrentChannels] = useState([]);
  const [currentMessages, setCurretMessages] = useState([]);

  const handleChannelSelect = (channelDescriptor: ChannelDescriptor) => {
    channelDescriptor.getChannel().then(channel => {
      setCurrentChannel(channel);
      return channel.getMessages(MESSAGE_COUNT);
    }).then((result) => {
      setCurretMessages(result.items);
    });
  };

  useEffect(() => {
    (async () => {
      if (!twilio) {
        return;
      }
      const result = await twilio.getUserChannelDescriptors();
      setCurrentChannels(result.items);

      handleChannelSelect(result.items[0]);
    })();
  }, [twilio, setCurrentChannels])

  return (
    <div className="main">
      <div className="channels">
        <ChannelList channels={currentChannels} onChannelSelect={handleChannelSelect} />
      </div>
      <div className="messages">
        <MessageList items={currentMessages} />
        <MessageField channel={currentChannel} />
      </div>
    </div>
  );
};