const yargs = require('yargs');
const Records = require('./records.js');

const record = new Records();
const title = { describe: 'Title of record', demand: true, alias: 't' };
const username = { describe: 'Username', demand: true, alias: 'u' };
const password = { describe: 'Password', demand: true, alias: 'p' };
const argv = yargs
  .command('create', 'Create new record', { title, username, password })
  .command('read', 'Read existing record', { title })
  .command('all', 'Read all existing records')
  .command('update', 'Update existing record', { title, username, password })
  .command('delete', 'Delete existing record', { title })
  .help().argv;

switch (argv._[0]) {
  case 'create': {
    let isAdded = record.add(argv.title, argv.username, argv.password);
    if (isAdded) {
      console.log('Record created.');
    } else {
      console.log('Record title already exists.');
    }
    break;
  }
  case 'read': {
    let results = record.get(argv.title);
    if (results.length === 0) {
      console.log('Record does not exist.');
    } else {
      record.log(results[0]);
    }
    break;
  }
  case 'all': {
    let results = record.getAll();
    if (results.length === 0) {
      console.log('No records.');
    } else {
      for (let result of results) {
        record.log(result);
        console.log('-------');
      }
    }
    break;
  }
  case 'update': {
    let isUpdated = record.update(argv.title, argv.username, argv.password);
    if (isUpdated) {
      console.log('Record updated.');
    } else {
      console.log('Record title does not exist.');
    }
    break;
  }
  case 'delete': {
    let isDeleted = record.delete(argv.title);
    if (isDeleted) {
      console.log('Record deleted.');
    } else {
      console.log('Record title does not exist.');
    }
    break;
  }
  default:
    console.log('Command not recognized.');
}
