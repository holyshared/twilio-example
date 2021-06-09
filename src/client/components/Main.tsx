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
  const [currentUnreadCounts, setCurrentUnreadCounts] = useState<Map<string, number>>(new Map());
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

      const newUnreadCount = result.items.reduce((unread, item) => {
        let count = 0; 
        if (item.lastConsumedMessageIndex) {
          count = item.messagesCount - item.lastConsumedMessageIndex - 1;
        } else {
          count = item.messagesCount;
        }
        console.log("initial unread------------------");
        console.log(count);
        return unread.set(item.sid, count);
      }, currentUnreadCounts);
      setCurrentUnreadCounts(newUnreadCount);

      handleChannelSelect(result.items[0]);
    })();
  }, [twilio, setCurrentChannels, setCurrentUnreadCounts, currentUnreadCounts]);

  useEffect(() => {
    if (!currentChannel) {
      return;
    }
    const handleMessageAdded = (message) => {
      setCurretMessages([ ...currentMessages, message ]);
    };
    const handleUpdated = ({ channel, updateReasons }: { channel: Channel; updateReasons: string[]   }) => {
      const needUnreadUpdate = updateReasons.includes("lastMessage") || updateReasons.includes("lastConsumedMessageIndex");
      if (!needUnreadUpdate) {
        return;
      }
console.log("updated------------------");
console.log(channel.lastMessage.index - channel.lastConsumedMessageIndex);
      currentUnreadCounts.set(channel.sid, channel.lastMessage.index - channel.lastConsumedMessageIndex);
      setCurrentUnreadCounts(currentUnreadCounts);
    };
    currentChannel.removeListener("messageAdded", handleMessageAdded);
    currentChannel.removeListener("updated", handleUpdated);
    currentChannel.on("messageAdded", handleMessageAdded);
    currentChannel.on("updated", handleUpdated);

    return () => {
      currentChannel.removeListener("messageAdded", handleMessageAdded);
      currentChannel.removeListener("updated", handleUpdated);
    };
  }, [currentChannel, currentMessages, setCurretMessages, currentUnreadCounts, setCurrentUnreadCounts]);

  return (
    <div className="main">
      <div className="channels">
        <ChannelList channels={currentChannels} unreadCounts={currentUnreadCounts} onChannelSelect={handleChannelSelect} />
      </div>
      <div className="messages">
        <MessageList items={currentMessages} />
        <MessageField channel={currentChannel} />
      </div>
    </div>
  );
};