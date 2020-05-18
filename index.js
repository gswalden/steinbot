'use strict';

const Bot = require('node-telegram-bot');
const _ = require('lodash');
const random = _.sample;
const http = require('http');
const util = require('util');
const ms = require('ms');
const scrape = require('scrape-it');
const { getCurrentUrlAndPun, answer } = require('./punday');
let lastMsg = 0;
let lastImg;

const images = [
  'C9dbSsI',
  'n3IceiW',
  'F6FIQVv',
  'DbpIEmt',
  'qOuhbDu',
  'BEwy6xf',
  'tTVp3eD',
  '65xjKM9',
  'pKa0YqR',
  '4hEmCx1',
  '80x6csr',
  'KO2ZIbd',
  'J82wQKx',
  'btWvYOf',
  '1mAY9dH',
  'xvbLFMG',
  '8a8j2li',
  'J1x7aEC',
  'mVbKjVR',
  'EIryMhN',
  '5RTsW0C',
  'D6XzMG7',
  'Km8xgFR',
  'KpxgsAK',
  'xue6kHd',
  'NJwwzUU',
  'DufzhTQ',
  'pTPSbbr',
  'Vt4Drnz',
  '09dnOhu',
  'AhZiVPu',
  'lDtePvm',
  'sEwmkxB',
  '9Vm4PQH',
  'oWLBjYH',
];

const gil = ['Ws0yS27'];

const gong = [
  "Oh it's good",
  'NOT. GOOD.',
  'Good',
  'Not good',
  'Would burn, would laugh',
  'It hits',
];

const soup = [
  'Soup',
  'Sammy',
  'Soup there it is!',
  'Summer of Sammy',
  'Clearly soup',
  'Definite sammy',
  'Have you considered salad?',
];

const e40 = ['Yup.', 'Nope.'];

const sad = [
  // 'jzdy5Hy',
  'WCzfAJ8',
];

const committee = [
  "Yikes, that's gotta go to committee",
  "Farmin' it out to committee",
  "Goin' committee",
];

const decided = ['The committee is in:', 'Chuck has decreed:'];

const bot = new Bot({
  token: process.env.TELEGRAM_TOKEN,
})
  .on('message', message => {
    if (!message.text) return;
    respond(message);
    /*
  const delay = (_.random(99) < 5) ? _.random(ms('2min'), ms('5min')) : 0;
  _.delay(respond, delay, message);
  if (delay > 0) {
    _.delay(() => {
      bot.sendMessage({
        chat_id: message.chat.id,
        text: random(decided)
      });
    }, delay - 10);
    bot.sendMessage({
      chat_id: message.chat.id,
      text: random(committee)
    });
  }*/
  })
  .start();

async function respond(message) {
  if (/\!steines/i.test(message.text)) {
    console.log(message);

    let msg, time;
    if (Date.now() - lastMsg < ms('5s')) {
      msg = 'Slow down there, haus.';
    } else {
      let image;
      do {
        image = random(images);
      } while (image === lastImg);
      msg = util.format('https://i.imgur.com/%s.jpg', image);
      lastImg = image;
      time = Date.now();
    }

    bot.sendMessage(
      {
        chat_id: message.chat.id,
        text: msg,
      },
      () => {
        if (time) {
          lastMsg = time;
        }
      }
    );
  }
  if (/\!gil/i.test(message.text)) {
    bot.sendMessage({
      chat_id: message.chat.id,
      text: util.format('https://i.imgur.com/%s.jpg', random(gil)),
    });
  }
  if (/\!gong/i.test(message.text)) {
    bot.sendMessage({
      chat_id: message.chat.id,
      text: random(gong),
    });
  }
  if (/\!pun/i.test(message.text)) {
    const match = message.text.match(/!pun\s+([\w ]+)/);
    if (match) {
      const isCorrect = await answer(match[1]);
      if (isCorrect) {
        bot.sendMessage({
          chat_id: message.chat.id,
          text: `YES!: ${match[1].trim()}`,
        });
      } else {
        bot.sendMessage({
          chat_id: message.chat.id,
          text: `NO: ${match[1].trim()}`,
        });
      }
    } else {
      console.log('Getting pun...');
      const urlData = await getCurrentUrlAndPun();
      console.log('Saw', urlData);
      bot.sendPhoto({
        chat_id: message.chat.id,
        file_id: urlData.img,
        caption: urlData.link,
      });
    }
  }
  if (/\!(sos|soup|samm(y|ie))/i.test(message.text)) {
    bot.sendMessage({
      chat_id: message.chat.id,
      text: random(soup),
    });
  }
  if (/\!e40/i.test(message.text)) {
    bot.sendMessage({
      chat_id: message.chat.id,
      text: random(e40),
    });
  }
  if (/\bsad\b/i.test(message.text)) {
    sendSad(message);
  }
}

const sendSad = _.throttle(function (message) {
  bot.sendMessage({
    chat_id: message.chat.id,
    text: util.format('https://i.imgur.com/%s.jpg', random(sad)),
  });
}, 1000 * 60 * 5);

// require('./gil');

const server = http
  .createServer((req, res) => {
    res.end('Get in and get it!');
  })
  .listen(process.env.PORT || 8000, () => {
    console.log('Listening…');
  });

module.exports = server;

if (require.main === module) {
  // pun();
}
