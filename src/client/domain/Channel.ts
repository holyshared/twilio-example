import { Channel as TwilioChannel } from 'twilio-chat/lib/channel';
import { Message as TwilioMessage } from 'twilio-chat/lib/message';

export class Channel {
  private _channel: TwilioChannel;
  private _messages: TwilioMessage[] = [];
  private _unreadCount: number = 0;

  constructor(channel: TwilioChannel) {
    this._channel = channel;
    this._unreadCount = channel.lastMessage
      ? channel.lastMessage.index - channel.lastConsumedMessageIndex
      : 0;
  }
  get sid() {
    return this._channel.sid;
  }
  get name() {
    return this._channel.friendlyName;
  }
  get messages() {
    return this._messages;
  }
  get unreadCount() {
    return this._unreadCount;
  }
  //  public getMessages(pageSize?: number) {
  //  return this._channel.getMessages(pageSize);
  //  }
  public sendMessage(message: string, attributes: any) {
    return attributes
      ? this._channel.sendMessage(message, attributes)
      : this._channel.sendMessage(message);
  }
  public on(type: string, handler: any) {
    this._channel.on(type, handler);
  }
  public off(type: string, handler: any) {
    this._channel.removeListener(type, handler);
  }
  public refresh(updatedChannel: TwilioChannel) {
    this._unreadCount = updatedChannel.lastMessage
      ? updatedChannel.lastMessage.index -
        updatedChannel.lastConsumedMessageIndex
      : 0;
  }
  public addMessage(message) {
    this._messages.push(message);
  }
  public refreshMessages(pageSize?: number) {
    const self = this;
    return this._channel.getMessages(pageSize).then((result) => {
      this._messages = result.items;
      1;
      return self;
    });
  }
}
