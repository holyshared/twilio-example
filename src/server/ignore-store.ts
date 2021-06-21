import Redis from 'ioredis';

export const client = new Redis(process.env.REDIS_TLS_URL);

export const addIgnoreMessage = async (
  userId: string,
  channelId: string,
  messageIndex: string
) => {
  return client.rpushx(`${userId}#${channelId}`, messageIndex);
};

export const getIgnoreMessageIndexes = async (
  userId: string,
  channelIds: string[]
) => {
  const keys = channelIds.map((channelId) => `${userId}#${channelId}`);
  const messageIndexes = keys.map(async (key) => {
    const last = await client.llen(key);
    const indexes = await client.lrange(key, 0, last);
    return { channelId: key, messageIndexes: indexes };
  });
  return Promise.all(messageIndexes);
};
