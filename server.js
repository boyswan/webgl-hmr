const axios = require('axios');

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
const WebSocket = require('isomorphic-ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  axios
    .get('http://127.0.0.1:7890/ipvideo', {
      responseType: 'stream'
    })
    .then(response => {
      const stream = response.data;
      stream.on('data', chunk => {
        if (ws.readyState === ws.OPEN) ws.send(chunk);
      });
      stream.on('end', () => {
        output.end();
      });
    })
    .catch(console.log);
});
