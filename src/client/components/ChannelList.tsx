import React, { SyntheticEvent } from "react";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";

const Channel = ({ channel, onClick }: { channel: ChannelDescriptor, onClick: (channel: ChannelDescriptor) => void }) => {
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
      <a href={url} onClick={click} className="channel__button">{channel.friendlyName}</a>
    </li>
  );
};

export const ChannelList = ({ channels, onChannelSelect }: { channels: ChannelDescriptor[], onChannelSelect: (channel: ChannelDescriptor) => void; }) => {
  return (
    <ul className="channel__list">
      {channels.map(channel => (<Channel key={channel.sid} channel={channel} onClick={onChannelSelect} />))}
    </ul>
  );
}
