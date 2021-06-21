import React, { SyntheticEvent, useRef } from 'react';
import { Channel } from '../domain/Channel';

export const MessageField = ({ channel }: { channel: Channel }) => {
  const textareaRef = useRef<HTMLTextAreaElement>();
  const mutePushNotificationRef = useRef<HTMLInputElement>();
  const excludeUnreadRef = useRef<HTMLInputElement>();
  const handleSubmit = (evt: SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    let attributes = null;
    if (mutePushNotificationRef.current.checked) {
      attributes = {
        muteNotification: true,
      };
    }

    if (excludeUnreadRef.current.checked) {
      attributes = {
        saveMessageIndex: true,
      };
    }

    channel.sendMessage(textareaRef.current.value, attributes).then(() => {
      console.log('done send message');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="postMessage" ref={textareaRef} rows={3}></textarea>
      <label><input type="checkbox" ref={mutePushNotificationRef} /> Mute push notification</label>
      <label><input type="checkbox" ref={excludeUnreadRef} /> Exclude from unread</label>
      <input type="submit" value="Post" />
    </form>
  );
};
