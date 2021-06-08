import React, { useContext, useEffect, useState } from "react";
import { TwilioContext } from "./contexts/twilio";
import { ChannelList } from "./ChannelList";

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannels, setCurrentChannels] = useState([]);

  useEffect(() => {
    (async () => {
      if (!twilio) {
        return;
      }
      const result = await twilio.getUserChannelDescriptors();
      setCurrentChannels(result.items);
    })();
  }, [twilio, setCurrentChannels])

  return (
    <div>
      <ChannelList channels={currentChannels} />
    </div>
  );
};