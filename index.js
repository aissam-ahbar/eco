#!/usr/bin/env node
const fs = require('fs');

let mapIdNames = {};
let map = {};
fs.readFile('./data1.json', 'utf8', (err, jsonString1) => {
  if (err) {
    console.log('File1 read failed:', err);
    return;
  }

  fs.readFile('./data2.json', 'utf8', (err, jsonString2) => {
    if (err) {
      console.log('File2 read failed:', err);
      return;
    }
    loadNames(jsonString2);
    loadData(jsonString1);
  });
});

const loadNames = function (jsonString) {
  try {
    const items = JSON.parse(jsonString);
    for (let item of items) {
      if (item && item.id && item.name) {
        mapIdNames[item.id] = {
          name: item.name,
          brand: item.brand,
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
      console.log(mapIdNames);
      if (mapIdNames[item.fields.id]) {
        item.fields['name'] = mapIdNames[item.fields.id].name;
        item.fields['brand'] = mapIdNames[item.fields.id].brand;
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