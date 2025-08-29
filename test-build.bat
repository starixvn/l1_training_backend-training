@echo off
echo Testing Docker Compose build with one service...
echo.

echo Building SG API service only...
docker-compose build sg-api

echo.
echo Build completed. Check the output above for any errors.
echo If successful, you can now run: docker-compose up -d --build
echo.
pause
