import React, { SyntheticEvent } from "react";
import { Channel } from "../domain/Channel";

const ChannelItem = ({ channel, onClick }: { channel: Channel, onClick: (channel: Channel) => void }) => {
  const url = `#${channel.sid}`;
  const click = (evt: SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    onClick(channel);
  };
  return (
    <li className="channel">
      <a href={url} onClick={click} className="channel__button">
        <span className="channel__name">{channel.name}</span>
        {channel.unreadCount > 0 ? (<span className="channel__unread__count">{channel.unreadCount}</span>) : (<span className="channel__readed"></span>)}
      </a>
    </li>
  );
};

export const ChannelList = ({ current, channels, onChannelSelect }: { current: Channel, channels: Channel[], onChannelSelect: (prev: Channel, next: Channel) => void; }) => {
  const handleSelect = (next: Channel) => {
    onChannelSelect(current, next);
  };

  return (
    <ul className="channel__list">
      {channels.map(channel => {
        return (<ChannelItem key={channel.sid} channel={channel} onClick={handleSelect} />);
      })}
    </ul>
  );
}
