const fs = require('fs');


let meta = JSON.parse(fs.readFileSync('test.json', 'utf8'));
console.log(meta);