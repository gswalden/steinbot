const axios = require('axios');
const Cache = require('node-cache');
const FormData = require('form-data');
const myCache = new Cache({
  stdTTL: 60 * 60,
});

async function answer(text, id = null) {
  let link;
  if (id) {
    link = `https://mondaypunday.com/${id}`;
  } else {
    const data = await getCurrentUrlAndPun();
    link = data.link;
  }
  const form = new FormData();
  form.append('answer', text.trim().toLowerCase());
  const res = await axios.post(link, form, { headers: form.getHeaders() });
  if (res.data.match(/not\s+correct/i)) {
    return false;
  }
  return true;
}

async function getCurrentUrlAndPun() {
  const key = 'current-pun';
  const cachedVal = myCache.get(key);
  if (cachedVal) return cachedVal;

  const { data } = await scrape('https://mondaypunday.com', {
    img: {
      selector: 'figure img',
      attr: 'src',
    },
    link: {
      selector: 'link[rel=canonical]',
      attr: 'href',
    },
  });
  myCache.set(key, data);
  return data;
}

module.exports = {
  getCurrentUrlAndPun,
  answer,
};

if ((require.main = module)) {
  const res = answer('help', 481);
}
