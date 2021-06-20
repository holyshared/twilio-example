import Twilio from 'twilio-chat';
import { Channel as TwilioChannel } from 'twilio-chat/lib/channel';
import { Message as TwilioMessage } from 'twilio-chat/lib/message';
import { Channel } from '../../domain/Channel';

import firebase from 'firebase/app';
import 'firebase/messaging';

export interface TwilioClient {
  getSubscribedChannels(): Promise<Channel[]>;
  on(type: 'messageAdded' | 'channelUpdated', handler: any): void;
  listen(): Promise<void>;
}

type ChannelUpdated = (evt: {
  channel: TwilioChannel;
  updateReasons: string[];
}) => void;

type MessageAdded = (message: TwilioMessage) => void;

class TwilioClientAdapter implements TwilioClient {
  private twilio: Twilio;

  constructor(twilio: Twilio) {
    this.twilio = twilio;
  }

  async listen() {
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
      await this.twilio.setPushRegistrationId('fcm', fcmToken);
    }

    firebase.messaging().onMessage((payload) => {
      console.log('onMessage');
      console.log(payload);
      this.twilio.handlePushNotification(payload);
    });
  }

  async getSubscribedChannels() {
    let result = await this.twilio.getSubscribedChannels();
    let channels = result.items.map((item) => new Channel(item));
    while (result.hasNextPage) {
      result = await this.twilio.getSubscribedChannels();
      channels = channels.concat(result.items.map((item) => new Channel(item)));
    }

    return channels;
  }

  on(
    type: 'messageAdded' | 'channelUpdated',
    handler: MessageAdded | ChannelUpdated
  ): void {
    this.twilio.on(type, handler);
  }
}

export type Chat = Twilio;
export const create = (token) =>
  Twilio.create(token).then((client) => new TwilioClientAdapter(client));
