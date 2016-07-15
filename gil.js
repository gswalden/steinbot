'use strict';

if (!process.env.TELEGRAM_TOKEN_GIL || !process.env.NETTI_ID) return;

const Bot = require('node-telegram-bot')
  , _ = require('lodash')
  , ms = require('ms')
  ;

let cooldown = Date.now();

const bot = new Bot({
  token: process.env.TELEGRAM_TOKEN_GIL
}).on('message', message => {
  if (
    _.get(message, ('from.id')) != process.env.NETTI_ID
    || !_.isArray(message.entities)
    || Date.now() < cooldown
    // || !/cassaniti/i.test(_.get(message, ('from.last_name')))
  ) {
    console.log(message.from);
    console.log(message.text);
    return;
  }
    

  if (_.some(message.entities, entity => entity.type === 'url')) {
    bot.sendMessage({
      chat_id: message.chat.id,
      text: _.sample(stops)
    });
    cooldown = Date.now() + ms('1h');
    console.log(message);
  }
}).start();

const stops = [
  'Ya gotta stop',
  'YA STOP. It\'s what ya do.',
  // 'Uhhhhhhhhhhhhhhh',
  // 'UHHHHHHHHHHHHHHHHHHHHHHHHH'
]
