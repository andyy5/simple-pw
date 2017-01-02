const yargs = require('yargs');
const Records = require('./records.js'); // note: import/export in ES6 not supported by Node yet.

var Record;

class App {

    constructor() {
        Record = new Records();
    }

    init() {

        var titleOpt = {
            describe: 'Title of record',
            demand: true,
            alias: 't'
        };

        var usernameOpt = {
            describe: 'Username',
            demand: true,
            alias: 'u'
        };

        var passwordOpt = {
            describe: 'Password',
            demand: true,
            alias: 'p'
        };

        var argv = yargs
            .command('create', 'Create new record', {
                title: titleOpt,
                username: usernameOpt,
                password: passwordOpt
            })
            .command('read', 'Read existing record', {
                title: titleOpt
            })
            .command('all', 'Read all existing records')
            .command('update', 'Update existing record', {
                title: titleOpt,
                username: usernameOpt,
                password: passwordOpt
            })
            .command('delete', 'Delete existing record', {
                title: titleOpt
            })
            .help()
            .argv;

        var command = argv._[0];

        if (command === 'create') {
            let success = Record.addRecord(argv.title, argv.username, argv.password);
            if (success) {
                console.log('Record created.')
            } else {
                console.log('Failed. Record title already exists.')
            }

        } else if (command === 'read') {
            let results = Record.readRecord(argv.title);
            if (results.length === 1) {
                Record.logRec(results[0]);
            } else if (results.length === 0) {
                console.log('Record does not exist.')
            } else {
                console.log('Error.')
            }

        } else if (command === 'all') {
            let results = Record.getAllRecords();
            for (var i = 0; i < results.length; i++) {
                Record.logRec(results[i]);
                console.log("");
            }

        } else if (command === 'update') {
            let success = Record.updateRecord(argv.title, argv.username, argv.password);
            if (success) {
                console.log('Record updated.')
            } else {
                console.log('Failed. Record title does not exist.')
            }

        } else if (command === 'delete') {
            let success = Record.deleteRecord(argv.title);
            if (success) {
                console.log('Record deleted.')
            } else {
                console.log('Failed. Record title does not exist.')
            }

        } else {
            console.log('command not recognized');
        }
    }
}

var app = new App();
app.init();