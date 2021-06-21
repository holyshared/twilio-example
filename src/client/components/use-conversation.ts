import { useContext, useEffect, useState, useCallback } from 'react';
import { TwilioContext } from './contexts/twilio';
import { httpClient } from './contexts/axios';
import { IdentityContext } from './contexts/identity';
import { Channel as TwilioChannel } from 'twilio-chat/lib/channel';
import { Channel } from '../domain/Channel';

interface ReadedMessageIndexes {
  readedMessageIndexes: { channelId: string; messageIndexes: number[] }[];
}

export const useConversation = ({ messagCount }: { messagCount: number }) => {
  const twilio = useContext(TwilioContext);
  const identity = useContext(IdentityContext);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentChannels, setCurrentChannels] = useState<Channel[] | null>(
    null
  );

  const handleChannelSelect = useCallback(
    (_prev: Channel, next: Channel) => {
      next.refreshMessages(messagCount).then((channel) => {
        setCurrentChannel(channel);
      });
    },
    [setCurrentChannel, currentChannel]
  );

  useEffect(() => {
    (async () => {
      if (!twilio) {
        return;
      }

      const channels = await await twilio.getSubscribedChannels();
      const channel = await channels[0].refreshMessages(messagCount);

      const channelIds = channels.map((channel) => channel.sid);
      const res = await httpClient.get<ReadedMessageIndexes>(
        'marked_messages',
        {
          params: {
            userId: identity,
            channelIds,
          },
        }
      );
      res.data.readedMessageIndexes.forEach((readed) => {
        const target = channels.find((channel) => {
          return channel.sid === readed.channelId;
        });
        target.refreshIgnoreMessageIndexes(readed.messageIndexes);
      });

      twilio.on('messageAdded', (message) => {
        console.log('messageAdded');
        console.log(message);
        const target = channels.find((c) => c.sid === message.channel.sid);

        if (identity === 'auth0|60c3259acef301006a0e591a') {
          target.addMessageWithIgnoreMessage(message);
        } else {
          target.addMessage(message);
        }

        setCurrentChannels([...channels]);
      });

      twilio.on(
        'channelUpdated',
        ({
          channel,
          updateReasons,
        }: {
          channel: TwilioChannel;
          updateReasons: string[];
        }) => {
          const needUnreadUpdate =
            updateReasons.includes('lastMessage') ||
            updateReasons.includes('lastConsumedMessageIndex');

          if (!needUnreadUpdate) {
            return;
          }

          const target = channels.find((c) => c.sid === channel.sid);
          target.refresh(channel);

          setCurrentChannels([...channels]);
        }
      );

      await twilio.listen();

      setCurrentChannels(channels);
      setCurrentChannel(channel);
    })();
  }, [twilio]);

  return {
    currentChannel,
    joinedChannels: currentChannels,
    change: handleChannelSelect,
  };
};
