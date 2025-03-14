<h1 align="center">Chat API</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/6ill/ecommerce-api/blob/master/LICENSE)" target="_blank">
    <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-blue">
  </a>
</p>

## Description

A scalable real-time messaging application built with NestJS microservices architecture.

## Features

- Real-time messaging with WebSocket
- User authentication & authorization with JWT
- Friend system (add friends, see online status)
- Message history
- Online/offline presence tracking
- Persistent conversations

## Tech Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **Caching**: Redis
- **Message Broker**: RabbitMQ
- **WebSocket**: Socket.IO
- **Containerization**: Docker
- **ORM**: TypeORM

## Architecture

The application is built using a microservices architecture with the following services:

- **API Gateway** (Port 4000)
  - Entry point for client requests
  - Routes requests to appropriate microservices
  - Handles WebSocket connections

- **Auth Service**
  - User authentication and authorization
  - JWT token management
  - Friend system management

- **Chat Service** (Port 7000)
  - Handles message operations
  - Manages conversations
  - Real-time message delivery

- **Presence Service** (Port 6000)
  - Tracks user online/offline status
  - Manages user presence
  - Real-time status updates

## Prerequisites

- Docker and Docker Compose
- Node.js (v16+)
- PostgreSQL
- Redis
- RabbitMQ

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd messenger-clone/api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory with the following variables:
```env
# RabbitMQ
RABBITMQ_DEFAULT_USER=user
RABBITMQ_DEFAULT_PASS=password
RABBITMQ_USER=user
RABBITMQ_PASS=password
RABBITMQ_HOST=rabbitmq:5672

RABBITMQ_AUTH_QUEUE=auth_queue
RABBITMQ_PRESENCE_QUEUE=presence_queue
RABBITMQ_CHAT_QUEUE=chat_queue

# PostgreSQL
POSTGRES_USER=root
POSTGRES_PASSWORD=secret
POSTGRES_DB=messenger
POSTGRES_URI=pg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# pgAdmin
PGADMIN_DEFAULT_EMAIL=your-email@example.com
PGADMIN_DEFAULT_PASSWORD=password

# Auth
HASH_ROUND=12
JWT_SECRET=your-secret-key

# Redis
REDIS_PASS=password
REDIS_URI=redis://default:${REDIS_PASS}@redis:6379
```

## Running the Application

### Using Docker Compose (Recommended)

```bash
docker-compose up
```

This will start all services:
- API Gateway: http://localhost:4000
- Chat Service: http://localhost:7000
- Presence Service: http://localhost:6000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- RabbitMQ: localhost:5672 (Management UI: http://localhost:15672)
- pgAdmin: http://localhost:15432

### Development Mode

To run individual services:

```bash
# API Gateway
npm run start:dev api

# Auth Service
npm run start:dev auth

# Chat Service
npm run start:dev chat

# Presence Service
npm run start:dev presence
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Friends
- `GET /get-friends` - Get user's friend list
- `GET /add-friend/:id` - Send friend request

### WebSocket Events
- `connection` - Socket connection (requires JWT)
- `sendMessage` - Send new message
- `getConversations` - Get user conversations
- `friendActive` - Friend online/offline status updates

## Project Structure
```
api/
├── apps/
│   ├── api/          # API Gateway
│   ├── auth/         # Authentication Service
│   ├── chat/         # Chat Service
│   └── presence/     # Presence Service
├── libs/
│   └── common/       # Shared code
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
