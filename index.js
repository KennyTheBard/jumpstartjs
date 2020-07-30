
function extractSQL(meta) {
    if (!meta.models.source) {
        console.error("No source file for models");
        return;
    }

    let sql = fs.readFileSync(meta.models.source, 'utf8').toLowerCase();
    let instructions = sql.split(';');
    instructions = instructions.map(i => i.replace((/  |\r\n|\n|\r/gm),"")).filter(i => i.length > 0);
    // instructions.forEach((ins, idx) => console.log(`${idx} (${ins.length}): ${ins}`));

    let models = [];

    instructions.map(ins => {
        switch (ins.split(' ')[0]) {
            case 'create':
                if (ins.split(' ')[1] == 'table') {
                    return handleCreateTable(ins, models);
                } else {
                    console.error(`Unknown SQL command: ${ins.split(' ')[0]} ${ins.split(' ')[1]}`);
                }
                break;

            case 'alter':
                if (ins.split(' ')[1] == 'table') {
                    return handleAlterTable(ins, models);
                } else {
                    console.error(`Unknown SQL command: ${ins.split(' ')[0]} ${ins.split(' ')[1]}`);
                }
                break;

            default:
                console.error(`Unknown SQL command: ${ins.split(' ')[0]}`);
                return null;
        }
    });

    return models;
}

function handleCreateTable(instruction, models) {
    let fields = instruction.split('(')[1]
                            .replace((/\)/gm),"")
                            .split(',')
                            .map(f => f.trim())
                            .filter(f => f.length > 0);

    let obj = {
        meta: {
            tableName: instruction.split(' ')[2]
        },
        fields: fields.map(f => f.split(' ')).map(f => {
            return {
                name: f[0],
                type: f[1]
            };
        })
    };

    let pks = fields.filter(f => f.includes('primary key'));
    if (pks.length == 0) {
        console.error(`No primary key declared in ${instruction}`);
        return;
    } else if (pks.length > 1) {
        console.error(`Multiple primary keys declared in ${instruction}`);
        return;
    }

    obj.meta['pk'] = pks[0];
    models.push(obj);
}

function handleAlterTable(instruction, models) {
    let tableName = instruction.split(' ')[2];
    let candidates = models.filter(m => m.meta.tableName === tableName);

    if (candidates.length == 0) {
        console.error(`No table named ${tableName} in database`);
        return;
    } else if (candidates.length > 1) {
        console.error(`Multiple tables named ${tableName} in database`);
        return;
    }
    let table = candidates[0];

    let alterType = instruction.split(' ').slice(4, 6).join(' ');
    switch (alterType) {
        case 'foreign key':
            addForeignKey(instruction, table);
            break;

        default:
            console.error(`Unknown SQL command: ${instruction.split(' ').slice(0, 6).join(' ')}`);
    }
}

function addForeignKey(instruction, table) {
    
}

const fs = require('fs');

let meta = JSON.parse(fs.readFileSync('test.json', 'utf8'));

console.log(JSON.stringify(extractSQL(meta), null, 2));