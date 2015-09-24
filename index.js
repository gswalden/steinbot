var Bot = require('node-telegram-bot')
  , random = require('random-item')
  , http = require('http')
  , util = require('util')
  , ms = require('ms')
  , lastMsg = 0
  , lastImg
  ;

var images = [
  'C9dbSsI',
  'n3IceiW',
  'F6FIQVv',
  'DbpIEmt',
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
];

var bot = new Bot({
  token: '122937425:AAF1L6VZtpWIzTXpQ_4waPsBem4BLLTeNFA'
})
.on('message', function(message) {
  if (/\!steines/i.test(message.text)) {
    console.log(message);
    
    var msg, time;
    if (Date.now() - lastMsg < ms('10s')) {
      msg = 'Slow down there, haus.';
    } else {
      do {
        var image = random(images);
      } while (image === lastImg);
      msg = util.format('https://i.imgur.com/%s.jpg', image);
      lastImg = image;
      time = Date.now();
    }

    bot.sendMessage({
      chat_id: message.chat.id,
      text: msg
    }, function() {
      if (time) {
        lastMsg = time;
      }
    });
  }
})
.start();

var server = http.createServer(function(req, res) {
  res.end('Get in and get it!');
}).listen(process.env.PORT || 8000, function() {
  console.log('Listening…');
});
