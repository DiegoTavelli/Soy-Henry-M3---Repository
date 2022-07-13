const commands = require('./commands/index');



// Output un prompt
process.stdout.write('prompt → ');
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on('data', (data) => {
  let toStr = data.toString().trim().split(' ');
  let cmd = toStr.shift();
  if (typeof commands[cmd] === 'function') {
    commands[cmd](toStr)
  } else {
    process.stdout.write("↪ Command doesn't exist\n");
    process.stdout.write('prompt → ');
  }
});
