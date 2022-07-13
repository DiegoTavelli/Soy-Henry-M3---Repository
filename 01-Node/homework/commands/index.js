const fs = require('fs')
const request = require('request')

function date() {
  process.stdout.write(new Date() + '\n');
  process.stdout.write('prompt → ');
}

function pwd() {
  let thisFolder = process.cwd() + '\n';
  process.stdout.write(thisFolder);
  process.stdout.write('prompt → ');
}

function ls() {
  fs.readdir('.', (err, files) => {
    if (err) {
      console.log(err);
      process.stdout.write('\n prompt → ');
    }
    files.forEach((file) => {
      process.stdout.write("↣ " + file.toString() + '\n')
    })
    process.stdout.write('prompt → ');
  })
}

function echo(value) {
  value.forEach(val => {
    process.stdout.write('↺ ' + val + '\n')
  })
  process.stdout.write('prompt → ');
}

function cat(value) {
  value = value[0];
  if (!value) {
    process.stdout.write('… indicate file to read \n');
    process.stdout.write('prompt → ')
  } else {
    fs.readFile(`./${value}`, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        process.stdout.write('\n prompt → ');
      }
      else {
        process.stdout.write(data)
        process.stdout.write('\n prompt → ');
      }
    })
  }
}

function head(value) {
  value = value[0];
  if (!value) {
    process.stdout.write('… indicate file to preview \n');
    process.stdout.write('prompt → ')
  } else {
    fs.readFile(`./${value}`, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        process.stdout.write('\n prompt → ');
      }
      else {
        let cutedData = data.split('\n');
        let firstTen = cutedData.slice(0, 10);
        let joined = firstTen.join('\n');
        process.stdout.write(joined);
        process.stdout.write('\n prompt → ');
      }
    })
    process.stdout.write('prompt → ');
  }
}

function tail(value) {
  value = value[0];
  if (!value) {
    process.stdout.write('… indicate file to preview \n');
    process.stdout.write('prompt → ')
  } else {
    fs.readFile(`./${value}`, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        process.stdout.write('\n prompt → ');
      }
      else {
        let cutedData = data.split('\n');
        let firstTen = cutedData.slice(-10);
        let joined = firstTen.join('\n');
        process.stdout.write(joined);
        process.stdout.write('\n prompt → ');
      }
    })
    process.stdout.write('prompt → ');
  }
}

function curl(url) {
  request(`${url}`, (err, response, body) => {
    if (err) console.log(err);
    process.stdout.write(body)
    process.stdout.write('\n prompt → ');
  })
}

module.exports = {
  pwd,
  date,
  ls,
  echo,
  cat,
  head,
  tail,
  curl
}