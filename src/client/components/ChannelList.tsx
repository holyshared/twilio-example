import React from "react";
import { ChannelDescriptor } from "twilio-chat/lib/channeldescriptor";

export const ChannelList = ({ channels }: { channels: ChannelDescriptor[] }) => {
  return (
    <ul>
      {channels.map(channel => (<li key={channel.sid}>{channel.uniqueName}</li>))}
    </ul>
  );
}
