#!/bin/bash

echo "Starting L1.WebApi and L1.IdentityServerApi..."

# Start both services in the background
dotnet run --project L1.WebApi/L1.WebApi.csproj &
WEB_API_PID=$!

dotnet run --project L1.IdentityServerApi/L1.IdentityServerApi.csproj &
IDENTITY_API_PID=$!

echo "Services started successfully!"
echo "Press Ctrl+C to stop all services..."

# Wait for user interrupt (Ctrl+C)
trap "kill $WEB_API_PID $IDENTITY_API_PID; exit" INT
wait 