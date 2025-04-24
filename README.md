# Email Microservice

A robust, scalable microservice for handling email sending operations through a message queue system.

## Overview

This microservice provides a decoupled solution for email delivery, allowing your main application to offload email sending to a dedicated service. This approach improves performance, reliability, and scalability of your email operations.

## Features

- **Queue Management**: Efficiently handles email requests through a message queue
- **Background Processing**: Processes emails asynchronously without blocking the main application
- **Retry Mechanism**: Automatically retries failed email deliveries
- **Scalability**: Easily scale horizontally by adding more workers
- **Monitoring**: Track the status and performance of email sending operations
- **Prioritization**: Support for prioritizing urgent emails
- **Rate Limiting**: Control the rate of email sending to prevent being flagged as spam
- **Delayed Delivery**: Schedule emails to be sent at a future time

## Architecture

The microservice consists of the following components:

1. **API Layer**: Receives email requests from the primary backend
2. **Queue Manager**: Adds emails to the message queue
3. **Worker(s)**: Continuously polls the queue and processes emails
4. **Monitoring Dashboard**: Provides visibility into queue status and performance

## Technology Stack

- **Node.js/Express**: For the API layer
- **Redis**: As the underlying data store
- **BullMQ**: For advanced queue management features
- **Nodemailer**: For sending emails through various providers
- **Docker**: For containerization and easy deployment

## Why BullMQ?

While Redis's native LPUSH and BRPOP commands can be used to create a basic queue, BullMQ offers several advantages:

- **Reliability**: Persistent job storage that survives process crashes
- **Advanced Error Handling**: Sophisticated retry logic with configurable backoff
- **Monitoring Capabilities**: Integration with dashboards like Bull Board
- **Job Prioritization**: Easy management of job priorities
- **Concurrency Control**: Fine-grained control over worker concurrency
- **Event System**: Rich events for tracking job lifecycle

## Getting Started

### Prerequisites

- Node.js (v14+)
- Redis (v5+)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/email-microservice.git
   cd email-microservice
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration details.

4. Start the service:
   ```
   npm start
   ```

### Docker Deployment

To deploy using Docker:

```
docker-compose up -d
```

## API Documentation

### Send Email

```
POST /api/email
```

Request body:
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email content...",
  "priority": "high", // optional: "high", "normal", "low"
  "sendAt": "2025-05-01T10:00:00Z", // optional: ISO timestamp for delayed sending
  "attachments": [] // optional: array of attachment objects
}
```

Response:
```json
{
  "success": true,
  "jobId": "12345",
  "message": "Email queued successfully"
}
```

### Check Email Status

```
GET /api/email/:jobId
```

Response:
```json
{
  "jobId": "12345",
  "status": "completed", // "completed", "failed", "delayed", "active", "waiting"
  "attempts": 1,
  "processedAt": "2025-04-24T15:30:45Z"
}
```

## Configuration Options

The service can be configured via environment variables:

- `PORT`: API server port (default: 3000)
- `REDIS_URL`: Redis connection string
- `QUEUE_NAME`: Name of the email queue (default: "email-queue")
- `CONCURRENCY`: Number of concurrent email processing operations (default: 5)
- `MAX_RETRIES`: Maximum retry attempts for failed emails (default: 3)
- `BACKOFF_DELAY`: Delay between retry attempts in ms (default: 60000)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

## Monitoring

A monitoring dashboard is available at `/dashboard` when the service is running.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
