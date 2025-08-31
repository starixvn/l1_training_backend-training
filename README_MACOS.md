# Gaming Platform - macOS Setup Guide

This guide provides step-by-step instructions for setting up and running the gaming platform on macOS.

## 🚀 Quick Start

### 1. Prerequisites Installation

Before running the gaming platform, ensure you have the following installed:

#### Required Software

1. **Node.js** (v16 or higher)

   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or download from https://nodejs.org/
   ```

2. **Yarn** (Package manager)

   ```bash
   npm install -g yarn
   ```

3. **.NET SDK** (v5.0 or higher)

   ```bash
   # Using Homebrew
   brew install --cask dotnet

   # Or download from https://dotnet.microsoft.com/download
   ```

4. **MongoDB** (v4.4 or higher)
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew install mongodb/brew/mongodb-community
   ```

#### Optional Software

- **Homebrew** (Package manager for macOS)
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

### 2. Setup Scripts

Run the setup script to configure everything:

```bash
# Make setup script executable
chmod +x setup-macos.sh

# Run setup
./setup-macos.sh
```

This will:

- ✅ Check all prerequisites
- ✅ Make scripts executable
- ✅ Create additional utility scripts
- ✅ Provide usage instructions

## 📋 Available Scripts

After running the setup, you'll have these scripts available:

| Script             | Purpose              | Usage                |
| ------------------ | -------------------- | -------------------- |
| `run-services.sh`  | Start all services   | `./run-services.sh`  |
| `stop-services.sh` | Stop all services    | `./stop-services.sh` |
| `check-status.sh`  | Check service status | `./check-status.sh`  |

## 🎯 Step-by-Step Usage

### 1. Start MongoDB

First, ensure MongoDB is running:

```bash
# Start MongoDB as a service (recommended)
brew services start mongodb/brew/mongodb-community

# Or start manually
mongod --dbpath /usr/local/var/mongodb
```

### 2. Start All Services

```bash
./run-services.sh
```

This will:

- Set the npm registry to the company registry
- Import database data
- Start all 11 services in separate Terminal windows
- Display service URLs

### 3. Check Service Status

```bash
./check-status.sh
```

This shows which services are running and on which ports.

### 4. Stop All Services

```bash
./stop-services.sh
```

This will stop all services and MongoDB.

## 🌐 Service URLs

Once all services are running, they'll be available at:

| Service           | URL                   | Description           |
| ----------------- | --------------------- | --------------------- |
| IdentityServerApi | http://localhost:8001 | Authentication server |
| WebApi            | http://localhost:8002 | Main API              |
| SG.Api            | http://localhost:8003 | SG API                |
| User Service      | http://localhost:8004 | User management       |
| Game Management   | http://localhost:8005 | Game management       |
| Sedie Multiplayer | http://localhost:8006 | Multiplayer service   |
| Game Client       | http://localhost:8007 | Frontend application  |
| OW Simulator      | http://localhost:8008 | API simulator         |
| Lobby Simulator   | http://localhost:8009 | Lobby system          |
| Game Admin API    | http://localhost:7778 | Admin API             |
| Game Admin Site   | http://localhost:7779 | Admin interface       |

## 🔧 Key Differences from Windows

### Terminal Windows

- Each service opens in a separate Terminal window (using AppleScript)
- Services can be stopped by closing their terminal windows
- Individual service logs are visible in each window

### Environment Variables

- Uses `export` instead of `set` for environment variables
- Uses Unix-style paths with forward slashes
- Uses `lsof` for port checking instead of `netstat`

### Process Management

- Uses `lsof` and `kill` for process management
- Uses `pgrep` for finding processes
- Graceful shutdown with SIGTERM, force kill with SIGKILL

## 🛠️ Troubleshooting

### Common Issues

#### 1. Permission Denied

```bash
# Make scripts executable
chmod +x *.sh
```

#### 2. Port Already in Use

```bash
# Check what's using a port
lsof -i :8001

# Kill process using a port
kill -9 $(lsof -ti:8001)
```

#### 3. MongoDB Not Starting

```bash
# Check MongoDB status
brew services list | grep mongodb

# Start MongoDB manually
mongod --dbpath /usr/local/var/mongodb
```

#### 4. Node.js Version Issues

```bash
# Check Node.js version
node --version

# Update Node.js if needed
brew upgrade node
```

#### 5. .NET Not Found

```bash
# Check .NET installation
dotnet --version

# Install .NET if needed
brew install --cask dotnet
```

### Service-Specific Issues

#### .NET Services

- Ensure .NET 5.0+ is installed
- Check project target frameworks
- Verify package references

#### Node.js Services

- Ensure Node.js 16+ is installed
- Check yarn/npm versions
- Verify package.json scripts

#### MongoDB

- Ensure MongoDB is running
- Check database connection strings
- Verify data directory permissions

## 📊 Monitoring and Logs

### View Service Logs

Each service runs in its own Terminal window, so logs are visible there.

### Check Service Health

```bash
# Check all services
./check-status.sh

# Check specific port
lsof -i :8001
```

### Resource Usage

```bash
# Check system resources
top

# Check disk usage
df -h

# Check memory usage
vm_stat
```

## 🔒 Security Considerations

### Development Environment

- Services run on localhost only
- No SSL/TLS encryption
- Default development credentials
- Debug information enabled

### Production Considerations

- Use proper SSL certificates
- Secure database connections
- Environment-specific configurations
- Disable debug information

## 📈 Performance Tips

### System Optimization

1. **Increase Terminal Memory**: Terminal → Preferences → Profiles → Advanced → Memory
2. **Close Unused Applications**: Free up RAM for services
3. **Use SSD Storage**: Faster database and file operations
4. **Monitor Resource Usage**: Use Activity Monitor

### Service Optimization

1. **Start Services Gradually**: Don't start all at once
2. **Monitor Memory Usage**: Check for memory leaks
3. **Use Development Mode**: Faster builds and hot reloading
4. **Optimize Database**: Regular maintenance and indexing

## 🆘 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Run `./check-status.sh` to see service status
3. Check individual service logs in Terminal windows
4. Verify all prerequisites are installed
5. Check system resources

### Useful Commands

```bash
# System information
system_profiler SPSoftwareDataType

# Check installed software
brew list

# Check service status
brew services list

# View system logs
log show --predicate 'process == "mongod"' --last 1h
```

### Common Debug Commands

```bash
# Check if port is in use
lsof -i :8001

# Check process status
ps aux | grep node

# Check disk space
df -h

# Check memory usage
top -l 1 | head -10
```

## 📝 Notes

- **Terminal Windows**: Each service opens in a separate Terminal window for easy monitoring
- **Graceful Shutdown**: Use `./stop-services.sh` for clean shutdown
- **Development Mode**: All services run in development mode with hot reloading
- **Company Registry**: NPM registry is automatically set to company registry
- **Database**: MongoDB data is stored in `/usr/local/var/mongodb`

---

**Note**: This setup is designed for development environments on macOS. For production deployment, additional security and performance configurations are required.
