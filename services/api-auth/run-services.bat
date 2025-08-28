@echo off
echo Starting L1.WebApi and L1.IdentityServerApi...

start "L1.WebApi" dotnet run --project L1.WebApi/L1.WebApi.csproj
start "L1.IdentityServerApi" dotnet run --project L1.IdentityServerApi/L1.IdentityServerApi.csproj

echo Services started successfully!
echo Press any key to stop all services...
pause > nul