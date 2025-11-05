import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { connectToDatabase, closeDatabase } from './database/connection';
import { UserService } from './database/userService';

async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Initialize database indexes
    const userService = new UserService();
    await userService.createIndexes();

    // Create Express app
    const app = express();
    
    // Create HTTP server
    const httpServer = http.createServer(app);

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await server.start();

    // Apply middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server)
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });

    // Start the HTTP server
    const PORT = process.env.PORT || 3000;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);

    // Graceful shutdown handler
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await closeDatabase();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('❌ Error starting server:', error);
    await closeDatabase();
    process.exit(1);
  }
}

// Start the server
startServer();
