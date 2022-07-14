const http = require('http');
const fs = require('fs');
const { setMaxListeners } = require('events');

const PORT = 3000;


const beatles = [{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic: "https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic: "http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic: "https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic: "http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]


http.createServer((req, res) => {
  if (req.url === '/api' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(beatles))
  }
  if (req.url.substring(0, 5) === '/api/' && req.method === 'GET') {
    const search = req.url.split('/').pop()
    const beatle = beatles.find(beatle => beatle.name === decodeURI(search))
    if (beatle) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(beatle))
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      return res.end('<h1>Beatle no encontrado</h1>')
    }
  }
  if (req.url[0] === '/' && req.url.length > 1 && req.method === 'GET') {
    const search = req.url.split('/').pop()
    const beatle = beatles.find(beatle => beatle.name === decodeURI(search))
    if (beatle) {
      return readFile('./beatle.html').then(html => {
        html = html.replaceAll('{name}', beatle.name) // or /{name}/g
        html = html.replace('{profilePic}', beatle.profilePic)
        html = html.replace('{birthdate}', beatle.birthdate)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      return res.end('<h1>Beatle no encontrado</h1>')
    }
  }
  if (req.url[0] === '/' && req.url.length === 1 && req.method === 'GET') {
    return readFile('./index.html')
      .then(html => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
      })
  }
})
  .listen(PORT, '127.0.0.1')



function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}