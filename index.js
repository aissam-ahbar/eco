#!/usr/bin/env node
const fs = require('fs');

fs.readFile('./data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log('File read failed:', err);
    return;
  }
  let map = {};
  try {
    const items = JSON.parse(jsonString);
    for (let item of items) {
      if (!map[item.fields.ville]) {
        map[item.fields.ville.toLowerCase()] = [];
        map[item.fields.ville.toLowerCase()].push(item.fields);
      } else {
        map[item.fields.ville.toLowerCase()].push(item.fields);
      }
    }
  } catch (err) {
    console.log('Error parsing JSON string:', err);
  }
  console.log(map);

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
