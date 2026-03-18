const WebSocket = require('ws');

let wss = null;

/**
 * Khởi tạo WebSocket server gắn vào HTTP server
 */
function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected. Total:', wss.clients.size);

    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected. Total:', wss.clients.size);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });

    // Gửi welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      data: { message: 'Connected to IoT Smart Home WebSocket', timestamp: new Date() }
    }));
  });

  console.log('🔌 WebSocket server initialized');
}

/**
 * Broadcast message tới tất cả clients
 * @param {Object} message - { type: string, data: object }
 */
function broadcast(message) {
  if (!wss) return;

  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

module.exports = {
  init,
  broadcast,
};
