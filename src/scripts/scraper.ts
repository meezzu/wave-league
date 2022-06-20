import axios from 'axios';
import * as cheerio from 'cheerio';
import env from '../common/config/env';

async function scrapeKworbData(url: string) {
  try {
    const unsortedArray = [];
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const list = $('table > tbody > tr > td');
    list.each((_, el) => {
      unsortedArray.push($(el).text());
    });

    let objectKey = [];
    objectKey[0] = 'Position';
    objectKey[1] = 'Ranking';
    objectKey[2] = 'Artiste';
    const groupedArray = [];

    while (unsortedArray.length) {
      groupedArray.push(unsortedArray.splice(0, 3));
    }

    const r = [];
    for (let index = 0; index < groupedArray.length; index++) {
      const objects = {};
      objectKey.forEach((key, i) => (objects[key] = groupedArray[index][i]));

      r.push(objects);
    }

    for (let index = 0; index < r.length; index++) {
      const removeSongTitle = r[index].Artiste.split(' -')[0];
      const splitArtistes = removeSongTitle.split(/[&,]/g);
      r[index].Artiste = splitArtistes.map((element: string) => element.trim());
    }

    return r;
  } catch (error) {
    console.log(error);
  }
}

async function scrapeBoomPlayData(url: string) {
  try {
    const unsortedArray = [];
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const list = $('.songsMenu > li > a > .songText > .singerName');
    list.each((idx, el) => {
      unsortedArray.push($(el).text());
    });

    const loopedNames = unsortedArray.map(el => {
      return el.split('-')[0].trim();
    });

    let objectKey = [];
    objectKey[0] = 'Song';
    objectKey[1] = 'Position';
    objectKey[2] = 'Artistename';

    const groupedArray = [];

    while (unsortedArray.length) {
      groupedArray.push(unsortedArray.splice(0, 1));
    }

    groupedArray.map((item, index) => {
      return groupedArray[index].push(index + 1);
    });

    groupedArray.map((item, index) => {
      return groupedArray[index].push(loopedNames[index]);
    });

    const RankedObject = [];
    for (let index = 0; index < groupedArray.length; index++) {
      const objects = {};
      objectKey.forEach((key, i) => {
        objects[key] = groupedArray[index][i];
      });
      RankedObject.push(objects);
    }
    const answer = RankedObject;
    return answer;
  } catch (error) {
    console.log(error);
  }
}

scrapeKworbData(env.kworb_url).then(console.log);
scrapeBoomPlayData(env.boomplay_url).then(console.log);
