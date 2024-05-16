import app from './app.js';
import { connectToDatabase } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
