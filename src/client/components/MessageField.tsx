import React, { SyntheticEvent, useRef } from 'react';
import { Channel } from '../domain/Channel';

export const MessageField = ({ channel }: { channel: Channel }) => {
  const textareaRef = useRef<HTMLTextAreaElement>();
  const handleSubmit = (evt: SyntheticEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    channel.sendMessage(textareaRef.current.value).then(() => {
      console.log('successs');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="postMessage" ref={textareaRef} rows={3}></textarea>
      <input type="submit" value="Post" />
    </form>
  );
};
