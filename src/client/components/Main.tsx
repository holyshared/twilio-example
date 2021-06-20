import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TwilioContext } from './contexts/twilio';
import { ChannelList } from './ChannelList';
import { MessageList } from './MessageList';
import { MessageField } from './MessageField';
import { Channel as TwilioChannel } from 'twilio-chat/lib/channel';
import { Channel } from '../domain/Channel';
import { Loading } from './Loading';

import firebase from 'firebase/app';
import 'firebase/messaging';

const MESSAGE_COUNT = 10;

export const Main = () => {
  const twilio = useContext(TwilioContext);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentChannels, setCurrentChannels] = useState<Channel[] | null>(
    null
  );

  const handleChannelSelect = useCallback(
    (_prev: Channel, next: Channel) => {
      next.refreshMessages(MESSAGE_COUNT).then((channel) => {
        setCurrentChannel(channel);
      });
    },
    [setCurrentChannel, currentChannel]
  );

  const handleUpdated = useCallback(
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

      const target = currentChannels.find((c) => c.sid === channel.sid);
      target.refresh(channel);

      setCurrentChannels([...currentChannels]);
    },
    [setCurrentChannels, currentChannels]
  );

  const handleMessageAdded = useCallback(
    (message) => {
      const target = currentChannels.find((c) => c.sid === message.channel.sid);
      target.addMessage(message);

      setCurrentChannels([...currentChannels]);
    },
    [setCurrentChannel, currentChannels]
  );

  const handlePushNotification = useCallback((payload) => {
    console.log(payload);
  }, []);

  useEffect(() => {
    (async () => {
      if (!twilio) {
        return;
      }
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };
      firebase.initializeApp(firebaseConfig);

      if (firebase && firebase.messaging()) {
        console.log('set fcm token');
        const fcmToken = await firebase.messaging().getToken();
        await twilio.setPushRegistrationId('fcm', fcmToken);
      }

      firebase.messaging().onMessage((payload) => {
        console.log('onMessage');
        console.log(payload);
        twilio.handlePushNotification(payload);
      });

      let result = await twilio.getSubscribedChannels();
      let channels = result.items.map((item) => new Channel(item));
      while (result.hasNextPage) {
        result = await twilio.getSubscribedChannels();
        channels = channels.concat(
          result.items.map((item) => new Channel(item))
        );
      }
      console.log('channel loaded');
      const channel = await channels[0].refreshMessages(MESSAGE_COUNT);

      setCurrentChannels(channels);
      setCurrentChannel(channel);
    })();
  }, [twilio]);

  useEffect(() => {
    twilio.on('messageAdded', handleMessageAdded);
    twilio.on('channelUpdated', handleUpdated);
    twilio.on('pushNotification', handlePushNotification);

    return () => {
      twilio.off('messageAdded', handleMessageAdded);
      twilio.off('channelUpdated', handleUpdated);
      twilio.off('pushNotification', handlePushNotification);
    };
  }, [currentChannels]);

  return (
    <div className="main">
      <div className="main__container">
        <div className="channels">
          {currentChannel && currentChannels ? (
            <ChannelList
              current={currentChannel}
              channels={currentChannels}
              onChannelSelect={handleChannelSelect}
            />
          ) : (
            <Loading message="Loading channels" />
          )}
        </div>
        <div className="messages">
          {currentChannel && currentChannels ? (
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
