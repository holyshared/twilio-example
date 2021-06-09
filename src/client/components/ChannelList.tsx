import React, { SyntheticEvent } from "react";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";

const Channel = ({ channel, unreadCount, onClick }: { channel: ChannelDescriptor, unreadCount: number; onClick: (channel: ChannelDescriptor) => void }) => {
  const url = `#${channel.sid}`;
  const click = (evt: SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("channle----");
    console.log(channel);
    onClick(channel);
  };
  return (
    <li className="channel">
      <a href={url} onClick={click} className="channel__button">
        <span className="channel__name">{channel.friendlyName}</span>
        {unreadCount > 0 ? (<span className="channel__unread__count">{unreadCount}</span>) : (<span className="channel__readed"></span>)}
      </a>
    </li>
  );
};

export const ChannelList = ({ channels, onChannelSelect, unreadCounts }: { channels: ChannelDescriptor[], unreadCounts: Map<string, number>; onChannelSelect: (channel: ChannelDescriptor) => void; }) => {
  return (
    <ul className="channel__list">
      {channels.map(channel => {
        const unread = unreadCounts.get(channel.sid);
        console.log("ChannelList--item");
        console.log(unread);
        return (<Channel key={channel.sid} channel={channel} unreadCount={unread} onClick={onChannelSelect} />);
      })}
    </ul>
  );
}
