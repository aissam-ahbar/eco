#!/usr/bin/env node
const fs = require('fs');

let mapIdNames = {};
let map = {};

const CHUNK_SIZE = 10000000; // 10MB

async function readStreamFile(filename) {
  const stream = fs.createReadStream(filename, {
    highWaterMark: CHUNK_SIZE,
  });
  let res = [];
  for await (const data of stream) {
    res.push(data.toString());
  }
  return res;
}

const loadNames = function (jsonString) {
  try {
    const items = JSON.parse(jsonString);
    for (let item of items) {
      if (item && item.id && item.name) {
        mapIdNames[item.id] = {
          name: item.name,
          brand: item.brand,
          shortage: item.shortage,
        };
      }
    }
  } catch (err) {
    console.log('Error parsing JSON string:', err);
  }
};

const loadData = function (jsonString) {
  try {
    const items = JSON.parse(jsonString);
    for (let item of items) {
      if (mapIdNames[item.fields.id]) {
        item.fields['name'] = mapIdNames[item.fields.id].name;
        item.fields['brand'] = mapIdNames[item.fields.id].brand;
        item.fields['shortage'] = mapIdNames[item.fields.id].shortage;
      }
      if (!map[item.fields.ville.toLowerCase()]) {
        map[item.fields.ville.toLowerCase()] = [];
        map[item.fields.ville.toLowerCase()].push(item.fields);
      } else {
        map[item.fields.ville.toLowerCase()].push(item.fields);
      }
    }
  } catch (err) {
    console.log('Error parsing JSON string:', err);
  }
  for (let city of Object.keys(map)) {
    const jsonString = JSON.stringify(map[city]);
    fs.writeFile('./' + city + '.json', jsonString, (err) => {
      if (err) {
        console.log('Error writing file', err);
      } else {
        console.log('Successfully wrote file');
      }
    });
  }
};

async function main() {
  let res1 = await readStreamFile('./data1.json');
  loadNames(res1);
  let res2 = await readStreamFile('./data2.json');
  loadData(res2);
}

main();
