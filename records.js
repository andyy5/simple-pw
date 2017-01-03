const fs = require('fs');
const crypto = require('crypto');

class Records {

    // fail if title already exists
    // output: boolean. False if addRecord failed.
    addRecord(title, username, password) {
        let existingRecords = this.getAllRecords();
        let ePw = this.encryptPw(title, password);
        let newRecord = {
            title,
            username,
            ePw
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

    // output: array with the record object with the title input
    readRecord(title) {
        let existingRecords = this.getAllRecords();
        let results = existingRecords.filter((rec) => rec.title === title);
        if (results.length !== 0) {
            let recObj = results[0];
            recObj.ePw = this.decryptPw(title, recObj.ePw);
        }
        return results;
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

        for (let i = 0; i < existingRecords.length; i++) {
            let recObj = existingRecords[i];
            if (recObj.title === title) {
                recObj.username = username;
                recObj.ePw = this.encryptPw(title, password);
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

    // generate random password
    // output: string (password)
    generatePw() {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";

        // http://stackoverflow.com/questions/1349404/
        for (let i = 0; i < 12; i++) {
            password += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return password;
    }

    // simple encryption that can be decrypted later (not hashed)
    // output: encrypted string (password)
    encryptPw(title, password) {
        let cipher = crypto.createCipher('aes256', title);
        return cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    }

    // output: decrypted string (password)
    decryptPw(title, password) {
        let decipher = crypto.createDecipher('aes256', title);
        return decipher.update(password, 'hex', 'utf8') + decipher.final('utf8');
    }

    // calculates password score, then assigns its strength (weak/medium/strong)
    logPwStrength(password) {
        let strength;
        let score = 0;

        // inc score for pw length
        if (password.length >= 5) {
            score++;
        }
        if (password.length >= 10) {
            score++;
        }
        // inc score for numerics
        var matches = password.match(/\d+/g);
        if (matches != null) {
            score++;
        }
        if (password.replace(/[^0-9]/g,"").length >= 5) {
            score++;
        }
        // inc score for capital letters
        if (password.replace(/[^A-Z]/g, "").length >= 2) {
            score++;
        }

        if (score <= 2) {
            strength = 'weak';
        } else if (score <= 4) {
            strength = 'medium';
        } else {
            strength = 'strong';
        }

        console.log('Password strength: ' + strength);
    }

    // log input record to console
    logRec(rec) {
        console.log('Title: ' + rec.title);
        console.log('Username: ' + rec.username);
        console.log('ePw: ' + rec.ePw);
    }

}

module.exports = Records;