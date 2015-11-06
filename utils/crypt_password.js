#!/usr/bin/env node

var Bcrypt   = require('bcrypt-nodejs'),
    ReadLine = require('readline-sync');

var password = ReadLine.question('Enter password (hidden input)', {hideEchoBack: true, mask: ''});
crypted_password = Bcrypt.hashSync(password, null, null);
console.log("Crypted password: " + crypted_password);
