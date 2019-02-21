var exports = module.exports = {};

let stonePosition = [
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]],
  [[null], [null], [null], [null], [null], [null], [null], [null], [null], [null]]
];
let color = ["black", "white"];

function resetRoomConfig(socket1, socket2) {
  var config = {};
  config["turn"] = 1;
  config["stones"] = stonePosition;
  if (Math.floor((Math.random() * 2) + 1) == 1) {
    config["black"] = socket1;
    config["white"] = socket2;
  }
  else {
    config["black"] = socket2;
    config["white"] = socket1;
  }
  config["socketTurn"] = config["black"];
  config["stoneTurn"] = "black";
  return config;
}

function isWin(stoneColor, stoneArr) {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var isFlag = true;
      // 가로로 5개 확인
      for (var k = 0; k < 5; k++) {
        if (j > 5) {
          isFlag = false;
          break;
        }
        if (stoneArr[i][j + k] != stoneColor) { 
          isFlag = false;
          break;
        }
      }
      if (isFlag == true) { return true }
      isFlag = true;
      // 세로로 5개 확인
      for (var k = 0; k < 5; k++) {
        if (i > 5) {
          isFlag = false;
          break;
        }
        if (stoneArr[i + k][j] != stoneColor) {
          isFlag = false;
          break;
        }
      }
      if (isFlag == true) { return true }
      isFlag = true
      // 대각선으로 5개 확인
      for (var k = 0; k < 5; k++) {
        if (i > 5 || j > 5) {
          isFlag = false;
          break;
        }
        if (stoneArr[i + k][j + k] != stoneColor) {
          isFlag = false;
          break;
        }
      }
      if (isFlag == true) { return true }
    }
  }
}

function startGame(config, ns) {
  // 검정색 턴
  config["black"].on('putStone', (msg) => {
    config["stones"][msg["y"]][msg["x"]] = "black";
    ns.emit("putStone", {"x": msg["x"], "y": msg["y"], "color": "black"});
    config["turn"] += 1;
    console.log("White Turn " + config["turn"]);
    config["white"].emit("turn", "");
  });
  // 흰색 턴
  config["white"].on('putStone', (msg) => {
    config["stones"][msg["y"]][msg["x"]] = "white";
    ns.emit("putStone", {"x": msg["x"], "y": msg["y"], "color": "white"});
    config["turn"] += 1;
    console.log("Black Turn " + config["turn"]);
    config["black"].emit("turn", "");
  });
  // 검정색 턴 시작!
  console.log("Black Turn");
  config["black"].emit("turn", "");
}

module.exports.gameStatus = [false, false, false];

module.exports.prepareGame = (ns, roomIndex, emitGetPlayerNumber) => {
  console.log("Start Game");
  module.exports.gameStatus[roomIndex - 1] = true;
  emitGetPlayerNumber()
  console.log(module.exports.gameStatus);
  let config = resetRoomConfig(Object.values(ns.connected)[0], Object.values(ns.connected)[1]);
  config["black"].emit('startGame', {"startGame": true, "stone": "black"});
  config["white"].emit('startGame', {"startGame": true, "stone": "white"});
  startGame(config, ns)
}

module.exports.emitDisconnectedOppositePlayer = (ns, roomIndex, emitGetPlayerNumber) => {
  if (module.exports.gameStatus[roomIndex - 1] == true) {
    module.exports.gameStatus[roomIndex - 1] = false
    emitGetPlayerNumber()
    ns.emit("disconnectedOppositePlayer", "");
  }
  console.log(module.exports.gameStatus);
}