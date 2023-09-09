// Librerias
const express = require("express");
const handlebars = require("express-handlebars")


// Ruta de archivos
const vistasRouter = require('./routes/products.router.js');

// Server y Puerto
const app = express();
const port = 8080;

// Inicio el server
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Configuro y arranco Handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

// Router
app.use(express.static(__dirname+'/public'))
app.use('/',vistasRouter)



//  WebSocket
const http = require('http');
const socketIo = require('socket.io');

const serverSocket = http.createServer(app);
const io = socketIo(serverSocket);


io.on('connection', (serverSocket) => {
  console.log('Usuario conectado al WebSocket');

  // Aquí puedes definir eventos y lógica para escuchar y emitir actualizaciones en tiempo real.
});



/* // Mensaje por consola Servidor express
const server=app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
}); */

// Mensaje por consola Servidor Websocket
serverSocket.listen(port, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${port}`);
});

module.exports = { app, io };