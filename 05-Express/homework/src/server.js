// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let prevId = 0;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
server.post('/posts', (req, res) => {
  const { author, title, contents } = req.body;

  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
  }
  res.json(addPost(author, title, contents))
})

server.post('/posts/author/:author', (req, res) => {
  const { title, contents } = req.body;
  const { author } = req.params;

  if (!title || !contents) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
  }
  res.json(addPost(author, title, contents))
})

server.get('/posts', (req, res) => {
  if (req.query.term) {
    return res.json(
      posts.filter((post) =>
        post.title.includes(req.query.term) ||
        post.contents.includes(req.query.term)
      ))
  }
  res.json(posts)
})

server.get('/posts/:author', (req, res) => {
  const result = posts.filter(post => post.author === req.params.author)

  if (!result.length) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" })
  }
  res.json(result)
})

server.get('/posts/:author/:title', (req, res) => {
  const result = posts.filter(
    post => post.author === req.params.author &&
      post.title === req.params.title)

  if (!result.length) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post con dicho titulo y autor indicado" })
  }
  res.json(result)
})

server.put('/posts', (req, res) => {
  const { id, title, contents } = req.body;
  if (!id || !title || !contents) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No se recibieron los parámetros necesarios para modificar el Post" })
  }
  let post = posts.find(post => post.id === id)
  if (!post) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "El id no corresponde a ningun post" })
  }
  post.title = title;
  post.contents = contents;
  res.json(post)
})


server.delete('/posts', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "Mensaje de error" })
  }
  let post = posts.find(post => post.id === id)
  if (!post) {
    return res.status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" })
  }
  posts = posts.filter(post => post.id !== id)
  res.json({ success: true })
})


server.delete('/author', (req, res) => {
  const { author } = req.body;
  if (!author) {
    return res.status(STATUS_USER_ERROR)
      .json({ "error": "Mensaje de error" })
  }
  let deletedPost = posts.filter(post => post.author === author)
  if (!deletedPost.length) {
    return res.status(STATUS_USER_ERROR)
      .json({ "error": "No existe el autor indicado" })
  }
  posts = posts.filter(post => post.author !== author)
  res.json(deletedPost)
})



function addPost(author, title, contents) {
  const post = { author, title, contents, id: ++prevId };
  posts.push(post);
  return post;
}



module.exports = { posts, server };
