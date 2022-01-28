const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closureyar
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests
server.post('/posts',(req, res) => {
  const{author, title, contents} = req.body;
  if(author && title && contents){
    const newPost = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parametros necesarios para crear el Post',
    });
  }
});
server.post('/posts/author/:author',(req, res) =>{
  const{title, contents} = req.body;
  const {author} = req.params.author;
  if(author){
    const newPost = {
      author: req.body.author,
      title : req.body.title,
      contents : req.body.contents,
    };
    posts.push(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parámetros necesarios para crear el Post',
    });
  }
});

server.get('/posts/:author', (req, res) =>{
  const author = req.params.author;
  const id = req.params.id;
  console.log(author);
  console.log(id);
  if(author && id){
    res.json({
      id,
      author,
      title,
      contents,
    });
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No existe ningun post del autor indicado',
    });
  }
});
server.put('posts', (req, res)=>{
  const{id, title, contents} = req.body;
  if(id && title && contents){
    if(id){
      
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: 'El id no corresponde a una post valido'
      })
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: ' No se recibieron los parámetros necesarios para modificar el Post',
    });
  }
});
module.exports = { posts, server };
