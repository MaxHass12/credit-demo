import logger from './utils/logger.js';
import { webServer } from './app.js';
import config from './utils/config.js';
import setupSocket from './socket.js';

setupSocket(webServer);

const PORT = config.PORT;

// Start server
webServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
