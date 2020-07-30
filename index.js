const extractSQL = require('./parser/parse_sql.js');
const dotenv = require('./writer/dotenv.js');

const fs = require('fs');

let meta = JSON.parse(fs.readFileSync('test.json', 'utf8'));

let dependencies = {};

let res = extractSQL(meta.models);
console.log(JSON.stringify(res, null, 2));

dotenv(meta.dotenv, dependencies);
console.log(dependencies);