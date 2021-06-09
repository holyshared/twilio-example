import React, { useEffect, useState, useCallback } from "react";
import { Message } from "twilio-chat/lib/message";
import { Channel } from "../domain/Channel";

const MessageItem = ({ item }: { item: Message }) => {
  return (
    <div className="message">
      <span className="message__context">
        <span className="message__author">{item.memberSid ?  item.memberSid : "Not a member of the channel"}</span>
        <span className="message__date">{item.dateCreated.toString()}</span>
      </span>
      <span className="message__body">{item.body}</span>
    </div>
  );
};

export const MessageList = ({ channel }: { channel: Channel }) => {
//  const [messages, setMessages] = useState(channel.messages);

  /*
  const handleMessageAdded = useCallback((message) => {
    messages.push(message);
    setMessages(messages);
  }, [messages, setMessages]);

  useEffect(() => {
    console.log(`messagedAdded off ${channel.sid}`);
    channel.off("messageAdded", handleMessageAdded);
    console.log(`messagedAdded on ${channel.sid}`);
    channel.on("messageAdded", handleMessageAdded);

    return () => {
      channel.off("messageAdded", handleMessageAdded);
    };
  }, [channel, handleMessageAdded]);
  */

  const render = (item) => <MessageItem key={item.sid} item={item} />;
  return (
    <div className="messages">
      {channel.messages.map(render)}
    </div>
  );
}
