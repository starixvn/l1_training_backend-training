# Local Development Services

## Service Endpoints

| Service                   | URL                    |
| ------------------------- | ---------------------- |
| Auth API                  | http://localhost:8001/ |
| Game API                  | http://localhost:8002/ |
| SG API                    | http://localhost:8003/ |
| User Service              | http://localhost:8004/ |
| Game Management Service   | http://localhost:8005/ |
| Sedie Multiplayer Service | http://localhost:8006/ |
| Game Client               | http://localhost:8007/ |
| 1W Simulator              | http://localhost:8008/ |
| Lobby Simulator           | http://localhost:8009/ |
| Game Admin API            | http://localhost:7778/ |
| Game Admin Site           | http://localhost:7779/ |

## Quick Start Using run-services.bat

1. Prerequisites:

   - Node.js and Yarn installed
   - .NET SDK installed
   - All dependencies installed for each service

2. Running the services:
   - Open Command Prompt as Administrator
   - Navigate to the project root directory
   - Execute `run-services.bat`

The batch file will:

- Import required database scripts
- Start all services in the correct order
- Open separate command windows for each service
- Display startup progress for each service

## Service Startup Order

The `run-services.bat` script handles the following sequence:

1. Database scripts initialization
2. Auth API (waits 5 seconds to ensure proper initialization)
3. Web API
4. SG API
5. User Service
6. 1W Simulator
7. Lobby Simulator
8. Game Client

## Development Guidelines

1. Each service runs on its own port to avoid conflicts
2. Make sure all services are running before starting development
3. Use the provided URLs to interact with the services
4. For local development, all services communicate over HTTP

## Getting Started

1. Clone the repository
2. Install dependencies for each service
3. Start the services in the following order:
   - Auth API
   - User Service
   - SG API
   - Game API
   - Simulators (1W and Lobby)

## Troubleshooting

If you encounter connection issues:

- Verify all services are running
- Check if the correct ports are being used
- Ensure no other applications are using these ports

If you encounter issues:

- Ensure all prerequisite software is installed
- Check if any services are already running on the required ports
- Review the command windows for specific error messages
- Make sure you're running Command Prompt as Administrator
