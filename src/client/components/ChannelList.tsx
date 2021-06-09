import React, { SyntheticEvent, useState, useEffect, useCallback } from "react";
import { Channel } from "../domain/Channel";
import { Channel as TwilioChannel } from "twilio-chat/lib/channel";

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
//  const [currentChannels, setChannels] = useState(channels);
  const handleSelect = (next: Channel) => {
    onChannelSelect(current, next);
  };
console.log("render ChannelList");
/*
  const handleUpdated = useCallback(({ channel, updateReasons }: { channel: TwilioChannel; updateReasons: string[]   }) => {
    const needUnreadUpdate = updateReasons.includes("lastMessage") || updateReasons.includes("lastConsumedMessageIndex");
    if (!needUnreadUpdate) {
      return;
    }
    console.log(`updated channels: ${channel.sid}`);
    console.log(updateReasons);
    console.log(currentChannels);

    const target = currentChannels.find(c => c.sid === channel.sid);
    target.refresh(channel);

    setChannels(currentChannels);
  }, [setChannels, currentChannels]);

  useEffect(() => {
    currentChannels.forEach(channel => {
      console.log(`listen: ${channel.name}`);
      channel.off("updated", handleUpdated);
      channel.on("updated", handleUpdated);
    });

    return () => {
      currentChannels.forEach(channel => {
        console.log(`listen off: ${channel.name}`);
        channel.off("updated", handleUpdated);
      });
    };
  }, [currentChannels]);
*/

  return (
    <ul className="channel__list">
      {channels.map(channel => {
        return (<ChannelItem key={channel.sid} channel={channel} onClick={handleSelect} />);
      })}
    </ul>
  );
}
