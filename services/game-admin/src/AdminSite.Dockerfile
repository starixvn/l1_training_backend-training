FROM hub.lumigame.com/base/dotnet/core/sdk:3.1-5-6 AS builder
WORKDIR /src

COPY ./GamesAdmin.Core ./GamesAdmin.Core
COPY ./GamesAdmin.Database ./GamesAdmin.Database
COPY ./GamesAdmin.Site/GamesAdmin.Site.csproj ./GamesAdmin.Site/GamesAdmin.Site.csproj

WORKDIR /src/GamesAdmin.Site
RUN dotnet restore -v diag

COPY ./GamesAdmin.Site .

RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM hub.lumigame.com/base/dotnet/core/aspnet:3.1.32-alpine AS base

RUN adduser admin_site_user --disabled-password
USER admin_site_user 
WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "GamesAdmin.Site.dll"]