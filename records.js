const fs = require('fs');
const Password = require('./password.js');

class Records {
  constructor() {
    this.password = new Password();
  }

  add(title, username, password) {
    let newRecord = {
      title,
      username,
      password: this.password.encrypt(title, password)
    };
    let existingRecords = this.read();
    let duplicates = existingRecords.filter(rec => rec.title === title);

    if (duplicates.length === 0) {
      existingRecords.push(newRecord);
      fs.writeFileSync('data.json', JSON.stringify(existingRecords));
      this.password.evalStrength(password);
      return true;
    } else {
      return false;
    }
  }

  get(title) {
    let existingRecords = this.read();
    let results = existingRecords.filter(rec => rec.title === title);
    if (results.length !== 0) results[0].password = this.password.decrypt(title, results[0].password);
    return results;
  }

  getAll() {
    let existingRecords = this.read();
    for (let record of existingRecords) {
      record.password = this.password.decrypt(record.title, record.password);
    }
    return existingRecords;
  }

  read() {
    try {
      let data = fs.readFileSync('data.json');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  update(title, username, password) {
    let isUpdated = false;
    let existingRecords = this.read();

    for (let record of existingRecords) {
      if (record.title === title) {
        record.username = username;
        record.password = this.password.encrypt(title, password);
        fs.writeFileSync('data.json', JSON.stringify(existingRecords));
        isUpdated = true;
        break;
      }
    }

    return isUpdated;
  }

  delete(title) {
    let isDeleted = false;
    let existingRecords = this.read();
    let resultRecords = existingRecords.filter(rec => rec.title !== title);

    if (existingRecords.length > resultRecords.length) {
      fs.writeFileSync('data.json', JSON.stringify(resultRecords));
      isDeleted = true;
    }

    return isDeleted;
  }

  log(rec) {
    console.log('Title: ' + rec.title);
    console.log('Username: ' + rec.username);
    console.log('Password: ' + rec.password);
  }
}

module.exports = Records;
