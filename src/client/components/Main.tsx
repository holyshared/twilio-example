import React, { useContext, useEffect, useState } from "react";
import { TwilioContext } from "./contexts/twilio";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { MessageField } from "./MessageField";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";
import { Channel } from "twilio-chat/lib/channel";

const MESSAGE_COUNT = 10;

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
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

  useEffect(() => {
    if (!currentChannel) {
      return;
    }
    const handleMessageAdded = (message) => {
      setCurretMessages([ ...currentMessages, message ]);
    };
  
    currentChannel.removeListener("messageAdded", handleMessageAdded);
    currentChannel.on("messageAdded", handleMessageAdded);

    return () => {
      currentChannel.removeListener("messageAdded", handleMessageAdded);
    };
  }, [currentChannel, currentMessages, setCurretMessages]);

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