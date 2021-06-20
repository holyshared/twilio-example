import React from 'react';
import { ChannelList } from './ChannelList';
import { MessageList } from './MessageList';
import { MessageField } from './MessageField';
import { Loading } from './Loading';
import { useConversation } from './use-conversation';

const MESSAGE_COUNT = 10;

export const Main = () => {
  const { currentChannel, joinedChannels, change } = useConversation({
    messagCount: MESSAGE_COUNT,
  });

  return (
    <div className="main">
      <div className="main__container">
        <div className="channels">
          {currentChannel && joinedChannels ? (
            <ChannelList
              current={currentChannel}
              channels={joinedChannels}
              onChannelSelect={change}
            />
          ) : (
            <Loading message="Loading channels" />
          )}
        </div>
        <div className="messages">
          {currentChannel && joinedChannels ? (
            <>
              <MessageList items={currentChannel.messages} />
              <MessageField channel={currentChannel} />
            </>
          ) : (
            <Loading message="Loading channel" />
          )}
        </div>
      </div>
    </div>
  );
};
