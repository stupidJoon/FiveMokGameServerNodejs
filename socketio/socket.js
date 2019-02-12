const game = require('../game/game.js');

var exports = module.exports = {};
let room1, room2, room3;


function mainSocket(ns) {
  ns.on('connection', (socket) => {
    console.log(ns.name + " Socket Connected, Now Connected " + Object.keys(ns.sockets).length + " player");
    socket.on('disconnect', () => { 
      console.log(ns.name + " Socket Disconnected, Now Connected " + Object.keys(ns.sockets).length + " player");
    });
  });
}

function gameSocket(ns, roomIndex) {
  ns.on('connection', (socket) => {
    console.log(ns.name + " Socket Connected, Now Connected " + Object.keys(ns.sockets).length + " player");
    socket.on('message', (msg) => {
      switch (msg) {
        case "startGame":
          if (Object.keys(ns.sockets).length == 2) {
            game.prepareGame(ns, roomIndex);
          }
          else {
            socket.emit('startGame', {"startGame": false, "message": "StartGame Failed Because Member of Player are " + Object.keys(ns.sockets).length})
          }
          break;
      }
    });
    socket.on('disconnect', () => {
      console.log(ns.name + " Socket Disconnected, Now Connected " + Object.keys(ns.sockets).length + " player");
    });
  });
}

module.exports.on = (io) => {
  main = io.of("/");
  room1 = io.of("/room1");
  room2 = io.of("/room2");
  room3 = io.of("/room3");
  mainSocket(main);
  gameSocket(room1, 1)
  gameSocket(room2, 2)
  gameSocket(room3, 3)
}