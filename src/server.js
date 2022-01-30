const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

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
server.get('/posts', (req, res) =>{
  const term = req.query.term;
  if(term){
    let aux = posts.filter(p => p.title.includes(term) || p.contents.includes(term));
    return res.json(aux);
  } else {
    return res.json(posts);
  }
});
server.post('/posts/author/:author',(req, res) =>{
  const{title, contents} = req.body;
  const author = req.params.author;
  if(author && title && contents ){
    const newPost = {
      id: newId(),
      author: author || req.body.author,
      title : title  || req.body.title,
      contents : contents || req.body.contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parámetros necesarios para crear el Post',
    });
  }
});

server.get('/posts/:author', (req, res) =>{
  const auaux = req.params.author;
  if(auaux){
    let aux = posts.filter(i => i.author.includes(auaux))
    if(aux.length !== 0){
      return res.json(aux); 
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: 'No existe ningun post del autor indicado',
      });
    }   
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No existe ningun post del autor indicado',
    });
  }
});
server.get('/posts/:author/:title', (req, res) =>{
  const authorAux = req.params.author;
  const titleAux = req.params.title;
  if (authorAux && titleAux){
    let aux = posts.filter(i => i.author.includes(authorAux) && i.title.includes(titleAux))
    if(aux.length !== 0){
      return res.json(aux); 
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: 'No existe ningun post con dicho titulo y autor indicado',
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'No existe ningun post con dicho titulo y autor indicado',
    });
  }
});
server.put("/posts", (req,res) => {
  const {id,title, contents}=req.body;
  if  (id && title && contents){
      let coincidencia = posts.find(e=>e.id===id);
      if (coincidencia){
        coincidencia.title=title;
        coincidencia.contents= contents;
        return res.json(coincidencia);
      }else{
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con el id indicado"});
      }
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error: 'No se recibieron los parámetros necesarios para modificar el Post',
    });
  }
});

server.delete('/posts', (req, res) => {
  const {id} = req.body;
  if(id){
    let aux = posts.find(post => post.id === id);
    if (aux){
      posts = posts.filter(p => p.id !== id);
    return res.json({
      success: true ,
    });
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: 'No existe el ID indicado',
      });
    }   
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'Mensaje de error',
    });
  }
});

server.delete('/author', (req, res) => {
  const {author} = req.body;
  if(author){
    let aux = posts.find(post => post.author === author);
    if (aux){
      let vectoraux = posts.filter(autor => autor.author === author);
      posts = posts.filter(autor => autor.author !== author);
      return res.json(vectoraux);
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: 'No existe el autor indicado',
      }); 
    }       
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: 'Mensaje de error',
    });
  }
});

module.exports = { posts, server };
