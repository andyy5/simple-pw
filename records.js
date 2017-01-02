const fs = require('fs');

class Records {

    // fail if title already exists
    // output: boolean. False if addRecord failed.
    addRecord(title, username, password) {
        let existingRecords = this.getAllRecords();
        let newRecord = {
            title,
            username,
            password
        };
        let dupeArray = existingRecords.filter((rec) => rec.title === title);

        if (dupeArray.length === 0) {
            existingRecords.push(newRecord);
            fs.writeFileSync('data.json', JSON.stringify(existingRecords));
            return true;
        } else {
            return false;
        }
    }

    // output: array with the record with the title input
    readRecord(title) {
        let existingRecords = this.getAllRecords();
        return existingRecords.filter((rec) => rec.title === title);
    }

    // output: array of all existing records
    getAllRecords() {
        try {
            let data = fs.readFileSync('data.json');
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    // output: boolean. False if update failed (title does not exist)
    updateRecord(title, username, password) {
        let isUpdated = false;
        let existingRecords = this.getAllRecords();

        for (var i = 0; i < existingRecords.length; i++) {
            let recObj = existingRecords[i];
            if (recObj.title === title) {
                recObj.username = username;
                recObj.password = password;
                isUpdated = true;
            }
        }

        if (isUpdated) {
            fs.writeFileSync('data.json', JSON.stringify(existingRecords));
        }

        return isUpdated;
    }

    // output: boolean. False is deletion failed (title does not exist)
    deleteRecord(title) {
        let isDeleted = false;
        let existingRecords = this.getAllRecords();

        var resultRecords = existingRecords.filter((rec) => rec.title !== title);
        fs.writeFileSync('data.json', JSON.stringify(resultRecords));

        if (existingRecords.length > resultRecords.length) {
            isDeleted = true;
        }

        return isDeleted;
    }

    // log input record to console
    logRec(rec) {
        console.log('Title: ' + rec.title);
        console.log('Username: ' + rec.username);
        console.log('Password: ' + rec.password);
    }

}

module.exports = Records;