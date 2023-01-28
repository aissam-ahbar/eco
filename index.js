#!/usr/bin/env node
const fs = require('fs');

let map;
fs.readFile('./data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log('File read failed:', err);
    return;
  }
  map = {};
  try {
    const items = JSON.parse(jsonString);
    for (let item of items) {
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
});
