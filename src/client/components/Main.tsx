import React, { useContext, useEffect, useState, useCallback } from "react";
import { TwilioContext } from "./contexts/twilio";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { MessageField } from "./MessageField";
import { Channel as TwilioChannel } from "twilio-chat/lib/channel";
import { Channel } from "../domain/Channel";
import { Loading } from "./Loading";

const MESSAGE_COUNT = 10;

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentChannels, setCurrentChannels] = useState<Channel[] | null>(null);

  const handleChannelSelect = useCallback((_prev: Channel, next: Channel) => {
    next.refreshMessages(MESSAGE_COUNT).then((channel) => {
      setCurrentChannel(channel);
    });
  }, [setCurrentChannel, currentChannel]);

  const handleUpdated = useCallback(({ channel, updateReasons }: { channel: TwilioChannel; updateReasons: string[] }, channels) => {
    const needUnreadUpdate = updateReasons.includes("lastMessage") || updateReasons.includes("lastConsumedMessageIndex");
    if (!needUnreadUpdate) {
      return;
    }
    console.log(`updated channels: ${channel.sid}`);

    const target = channels.find(c => c.sid === channel.sid);
    target.refresh(channel);

    setCurrentChannels([...channels]);
  }, [setCurrentChannels]);

  const handleMessageAdded = useCallback((message, channels) => {
console.log(message);
    const target = channels.find(c => c.sid === message.channel.sid);
    target.addMessage(message);

    setCurrentChannels([...channels]);
  }, [setCurrentChannel]);

  useEffect(() => {
    let c = (updated) => {
      console.log(currentChannel);
      console.log(currentChannels);
      handleUpdated(updated, currentChannels);
    };
    let d = (message) => {
      console.log(currentChannel);
      console.log(currentChannels);
      handleMessageAdded(message, currentChannels);
    };

    (async () => {
      if (!twilio) {
        return;
      }
      const result = await twilio.getSubscribedChannels();
      const channels = result.items.map(item => new Channel(item));
      const channel = await channels[0].refreshMessages(MESSAGE_COUNT);

      c = (updated) => {
        handleUpdated(updated, channels);
      };
      d = (message) => {
        handleMessageAdded(message, channels);
      };

      channels.forEach((channel) => {
        channel.on("updated", c);
        channel.on("messageAdded", d);
      });
      console.log("first set");
      setCurrentChannels(channels);
      setCurrentChannel(channel);
    })();

    return () => {
      currentChannels.forEach((channel) => {
        channel.on("updated", c);
        channel.on("messageAdded", d);
      });
    };
  }, [twilio]);

  return (
    <div className="main">
      <div className="channels">
        {currentChannel && currentChannels ? <ChannelList current={currentChannel} channels={currentChannels} onChannelSelect={handleChannelSelect} /> : <Loading message="Loading channels" />}  
      </div>
      <div className="messages">
        {currentChannel && currentChannels ? (
          <>
            <MessageList channel={currentChannel} />
            <MessageField channel={currentChannel} />
          </>
        ):  <Loading message="Loading channel" />}
      </div>
    </div>
  );
};