const RadioStation = require('../models/RadioStation');

const stationListeners = {};

const updateDBListenerCount = async (stationSlug, count) => {
  try {
    await RadioStation.updateOne({ slug: stationSlug }, { $set: { listenerCount: count } });
  } catch (err) {
    console.warn(`[Socket.io] DB listener count update failed for ${stationSlug}:`, err.message);
  }
};

const initRadioSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('join_station', async ({ stationSlug, user }) => {
      if (!stationSlug) return;
      socket.join(stationSlug);

      if (!stationListeners[stationSlug]) {
        stationListeners[stationSlug] = new Set();
      }
      stationListeners[stationSlug].add(socket.id);

      const count = stationListeners[stationSlug].size;
      io.to(stationSlug).emit('listener_update', { stationSlug, count });
      await updateDBListenerCount(stationSlug, count);

      console.log(`[Socket.io] ${socket.id} joined ${stationSlug}. Total listeners: ${count}`);
    });

    socket.on('leave_station', async ({ stationSlug }) => {
      if (!stationSlug) return;
      socket.leave(stationSlug);

      if (stationListeners[stationSlug]) {
        stationListeners[stationSlug].delete(socket.id);
        const count = stationListeners[stationSlug].size;
        io.to(stationSlug).emit('listener_update', { stationSlug, count });
        await updateDBListenerCount(stationSlug, count);
      }
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (stationListeners[room]) {
          stationListeners[room].delete(socket.id);
          const count = stationListeners[room].size;
          io.to(room).emit('listener_update', { stationSlug: room, count });
          updateDBListenerCount(room, count);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initRadioSocket;
