const fs = require('fs');

function dotenv(meta, dependencies) {
    let content = '#GENERAL\n';
    let nl = '\n';

    if (!!meta.env) {
        content += `NODE_ENV=${meta.env}` + nl;
    }
    if (!!meta.port) {
        content += `PORT=${meta.port}`;
    }

    if (content.split(/\r\n|\r|\n/).length > 2) {
        fs.writeFileSync('.env', content);

        if (!!meta.version) {
            dependencies.dotenv = meta.version;
        } else {
            dependencies.dotenv = "*";
        }
    }
}

module.exports = dotenv;