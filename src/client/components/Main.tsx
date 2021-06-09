import React, { useContext, useEffect, useState } from "react";
import { TwilioContext } from "./contexts/twilio";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";

const MESSAGE_COUNT = 15;

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannels, setCurrentChannels] = useState([]);
  const [currentMessages, setCurretMessages] = useState([]);

  const handleChannelSelect = (channelDescriptor: ChannelDescriptor) => {
    channelDescriptor.getChannel().then(channel => channel.getMessages(MESSAGE_COUNT)).then((result) => {
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
      </div>
    </div>
  );
};