# Docker Compose Setup for Game Services

This Docker Compose configuration **builds and runs** all game services from local source code with the specified URLs and ports.

## Service URLs

| Service                   | URL                   | Port  |
| ------------------------- | --------------------- | ----- |
| IdentityServerApi         | http://localhost:8001 | 8001  |
| WebApi                    | http://localhost:8002 | 8002  |
| SG.Api                    | http://localhost:8003 | 8003  |
| User Service              | http://localhost:8004 | 8004  |
| Game Management Service   | http://localhost:8005 | 8005  |
| Sedie Multiplayer Service | http://localhost:8006 | 8006  |
| Game Client               | http://localhost:8007 | 8007  |
| OW Simulator              | http://localhost:8008 | 8008  |
| Lobby Simulator           | http://localhost:8009 | 8009  |
| Soccer PinGoal Service    | http://localhost:8010 | 8010  |
| Game Admin API            | http://localhost:7778 | 7778  |
| Game Admin Site           | http://localhost:7779 | 7779  |
| MongoDB                   | localhost:27017       | 27017 |

## Quick Start

### Windows

```bash
start-services.bat
```

### Linux/Mac

```bash
./start-services.sh
```

### Manual Build and Start

```bash
# Build and start all services
docker-compose up -d --build

# Build specific service only
docker-compose build game-management-service

# Start without rebuilding (if images already exist)
docker-compose up -d
```

## Useful Commands

### Check Service Status

```bash
docker-compose ps
```

### View Build and Runtime Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f game-management-service

# View build logs only
docker-compose logs --no-log-prefix game-management-service
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Rebuild Specific Service

```bash
docker-compose build game-management-service
docker-compose up -d game-management-service
```

### Clean Build (Remove Images and Rebuild)

```bash
docker-compose down --rmi all
docker-compose up -d --build
```

## Service Details

### .NET Core Services

- **IdentityServerApi**: Authentication and authorization service
- **WebApi**: Main web API service
- **SG.Api**: SG API service
- **OW Simulator**: OW API simulator
- **Game Admin API**: Game administration API
- **Game Admin Site**: Game administration web interface

### Node.js Services

- **User Service**: User management service (port 5000)
- **Game Management Service**: Game management service (port 3000)
- **Sedie Multiplayer Service**: Multiplayer dice game service (port 8006)
- **Soccer PinGoal Service**: Soccer penalty shooting game service (port 8010)
- **Game Client**: Game client application (port 8007)
- **Lobby Simulator**: Game lobby simulator (port 8009)

### Database

- **MongoDB**: Database service (port 27017)

## Build Contexts

Each service builds from its local source code:

- `./services/api-auth/` - Identity Server API & Web API
- `./services/sg-api/` - SG API
- `./services/user-service/` - User Service
- `./services/game-management-service/` - Game Management Service
- `./services/services/sedie-multiplayer-service/` - Sedie Multiplayer Service
- `./services/services/soccer-pingoal-service/` - Soccer PinGoal Service
- `./services/game-client/` - Game Client
- `./services/ow-simulator/` - OW Simulator
- `./services/lobby-simulator/` - Lobby Simulator
- `./services/game-admin/src/` - Game Admin API & Site

## Environment Variables

All services are configured with appropriate environment variables:

- `.NET Core services`: `ASPNETCORE_ENVIRONMENT=Development`, `ASPNETCORE_URLS=http://+:80`
- `Node.js services`: `NODE_ENV=production`, `PORT=<service_port>`
- `MongoDB`: `MONGO_INITDB_ROOT_USERNAME=admin`, `MONGO_INITDB_ROOT_PASSWORD=password`

## Health Checks

The following services include health checks:

- **User Service**: HTTP health check on port 5000
- **Game Management Service**: HTTP health check on port 3000
- **Lobby Simulator**: Custom health check script

## Networking

All services are connected through a custom bridge network called `game-network`, allowing them to communicate with each other using service names as hostnames.

## Build Performance Tips

### Parallel Building

Docker Compose builds services in parallel by default. You can control the number of parallel builds:

```bash
docker-compose build --parallel --parallel-max 4
```

### Build Cache

Docker uses layer caching to speed up builds. To force a clean build:

```bash
docker-compose build --no-cache
```

### Build Specific Services

To build only specific services:

```bash
docker-compose build game-management-service user-service
```

## Troubleshooting

### Build Failures

1. **Check Dockerfile syntax**: `docker-compose config`
2. **View build logs**: `docker-compose logs <service-name>`
3. **Check source code**: Ensure all required files exist in build contexts
4. **Clear build cache**: `docker-compose build --no-cache <service-name>`

### Service Not Starting

1. Check if build was successful: `docker-compose ps`
2. View service logs: `docker-compose logs <service-name>`
3. Check port conflicts: Ensure no other services are using the same ports

### Port Already in Use

If a port is already in use, you can modify the external port in `docker-compose.yml`:

```yaml
ports:
  - "8001:80" # Change 8001 to another available port
```

### Memory Issues

If you encounter memory issues during builds, you can limit memory usage:

```bash
docker-compose build --memory=2g
```

Or limit specific services:

```yaml
services:
  game-management-service:
    build:
      context: ./services/game-management-service
      dockerfile: Dockerfile
    deploy:
      resources:
        limits:
          memory: 512M
```

## Data Persistence

- **MongoDB**: Data is persisted in a Docker volume `mongodb_data`
- **Other services**: Stateless services, no persistent data

## Security Notes

- All services run with non-root users where possible
- MongoDB has default credentials (change in production)
- Services are configured for development environment
- Consider using secrets management for production deployments
- Source code is built locally, ensuring no external image dependencies
