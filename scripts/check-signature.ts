import { validateRequest } from 'twilio'

const url = "https://twilio-hook-example.herokuapp.com/post-hook";

const result = validateRequest(process.env.TWILIO_AUTH_TOKEN, "pDYFsyE80ewkDEUX+8RXmiDVBlk=", url, {
  ChannelSid: 'CH2f8a71b897ab43419f32f251408d6431',
  RetryCount: '1',
  EventType: 'onMessageSent',
   InstanceSid: 'ISa1bc974c2bdd4f1493a21180cbb36194',
     Attributes: '{}',
    DateCreated: '2021-06-14T07:05:38.940Z',
    Index: '1',
    From: 'auth0|60c3259acef301006a0e591a',
     MessageSid: 'IM178af81b944d4f5798d80c444b6063bd',
    Body: 'message 1',
     AccountSid: 'AC60ba4e4775f9da8e2506d63f374d6ae5',
     Source: 'API'
})

console.log(result);