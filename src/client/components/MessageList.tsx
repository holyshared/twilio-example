import React from "react";
import { Message } from "twilio-chat/lib/message";

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

export const MessageList = ({ items }: { items: Message[] }) => {
  const render = (item) => <MessageItem key={item.sid} item={item} />;
  return (
    <ul>
      {items.map(render)}
    </ul>
  );
}
