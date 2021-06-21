import { Channel as TwilioChannel } from 'twilio-chat/lib/channel';
import { Message as TwilioMessage } from 'twilio-chat/lib/message';

export class Channel {
  private _channel: TwilioChannel;
  private _messages: TwilioMessage[] = [];
  private _unreadCount: number = 0;
  private _ignoreMessageIndexes: number[] = [];

  constructor(channel: TwilioChannel) {
    this._channel = channel;
    this._unreadCount = channel.lastMessage
      ? channel.lastMessage.index - channel.lastConsumedMessageIndex
      : 0;
    this._ignoreMessageIndexes = [];
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
    const lastConsumedMessageIndex =
      updatedChannel.lastConsumedMessageIndex || 0;
    const unreadCount = updatedChannel.lastMessage
      ? updatedChannel.lastMessage.index - lastConsumedMessageIndex
      : 0;
    const isIgnoreMessage = (messageIndex: number) => {
      console.log('ignore');
      console.log(messageIndex);
      return (
        updatedChannel.lastMessage.index >= messageIndex &&
        messageIndex >= lastConsumedMessageIndex
      );
    };

    const forceReadedCount = this._ignoreMessageIndexes.reduce(
      (total, index) => (isIgnoreMessage(index) ? total++ : total),
      0
    );
    console.log('consumed state');
    console.log(lastConsumedMessageIndex);
    console.log((updatedChannel.lastMessage || { index: 0 }).index);

    console.log('unreadCount');
    console.log(unreadCount);

    console.log('forceReadedCount');
    console.log(forceReadedCount);
    this._unreadCount = unreadCount - forceReadedCount;
    return this._unreadCount;
  }
  public addMessageWithIgnoreMessage(message: TwilioMessage) {
    const attributes = message.attributes as { saveMessageIndex?: boolean };

    if (!!attributes.saveMessageIndex) {
      this._ignoreMessageIndexes.push(message.index);
    }
    this._messages.push(message);
    this.refresh(message.channel);
  }

  public addMessage(message: TwilioMessage) {
    this._messages.push(message);
    this.refresh(message.channel);
  }

  public refreshIgnoreMessageIndexes(messageIndexs: number[]) {
    this._ignoreMessageIndexes = messageIndexs;
    this.refresh(this._channel);
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
