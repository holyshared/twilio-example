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

    const target = channels.find(c => c.sid === channel.sid);
    target.refresh(channel);

    setCurrentChannels([...channels]);
  }, [setCurrentChannels]);

  const handleMessageAdded = useCallback((message, channels) => {
    const target = channels.find(c => c.sid === message.channel.sid);
    target.addMessage(message);

    setCurrentChannels([...channels]);
  }, [setCurrentChannel]);

  useEffect(() => {
    let updated = (_updated) => {};
    let messageAdded = (_message) => {};

    (async () => {
      if (!twilio) {
        return;
      }
      const result = await twilio.getSubscribedChannels();
      const channels = result.items.map(item => new Channel(item));
      const channel = await channels[0].refreshMessages(MESSAGE_COUNT);

      updated = (updated) => handleUpdated(updated, channels);
      messageAdded = (message) => handleMessageAdded(message, channels);

      channels.forEach((channel) => {
        channel.on("updated", updated);
        channel.on("messageAdded", messageAdded);
      });
      setCurrentChannels(channels);
      setCurrentChannel(channel);
    })();

    return () => {
      currentChannels.forEach((channel) => {
        channel.off("updated", updated);
        channel.off("messageAdded", messageAdded);
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
            <MessageList items={currentChannel.messages} />
            <MessageField channel={currentChannel} />
          </>
        ):  <Loading message="Loading channel" />}
      </div>
    </div>
  );
};