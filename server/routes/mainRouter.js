import express from 'express';

const mainRouter = express.Router();

mainRouter.get('/', (_req, res) => {
  res.send('Express and Socket.IO are running on port 3001!');
});

export default mainRouter;
