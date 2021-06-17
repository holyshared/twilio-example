import React, { SyntheticEvent, useRef } from 'react';
import { Channel } from '../domain/Channel';

export const MessageField = ({ channel }: { channel: Channel }) => {
  const textareaRef = useRef<HTMLTextAreaElement>();
  const checkboxRef = useRef<HTMLInputElement>();
  const handleSubmit = (evt: SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    let attributes = null;
    if (checkboxRef.current.checked) {
      attributes = {
        muteNotification: true
      };
    }

    channel.sendMessage(textareaRef.current.value, attributes).then(() => {
      console.log("done send message");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="postMessage" ref={textareaRef} rows={3}></textarea>
      <label><input type="checkbox" ref={checkboxRef} /> Muto push notification</label>
      <input type="submit" value="Post" />
    </form>
  );
};
