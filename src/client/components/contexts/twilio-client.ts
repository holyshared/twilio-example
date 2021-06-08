import Twilio from "twilio-chat";

export type Chat = Twilio;
export const create = (token) => Twilio.create(token);