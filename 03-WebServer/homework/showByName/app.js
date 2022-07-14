const fs = require("fs")
const http = require("http")
const { resolve } = require("path")

const PORT = 3001

// Escribí acá tu servidor
http.createServer((req, res) => {
  const search = req.url.split('/').pop()
  return readFile(`./images/${search}`).then((data) => {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    res.end(data)
  },
    () => {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('<h1>Imagen no encontrada</h1>')
    })
}).listen(PORT, '127.0.0.1')


function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${path}`, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}