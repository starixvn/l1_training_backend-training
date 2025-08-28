FROM hub.lumigame.com/base/dotnet/core/sdk:3.1 AS builder

WORKDIR /src

COPY ./L1.Client ./L1.Client
COPY ./OW.ApiSimulator/OW.ApiSimulator.csproj ./OW.ApiSimulator/OW.ApiSimulator.csproj

WORKDIR /src/OW.ApiSimulator
RUN dotnet restore -v diag

COPY ./OW.ApiSimulator .
RUN dotnet publish -r linux-x64 --self-contained false -o /app 

FROM hub.lumigame.com/base/dotnet/core/aspnet:3.1.32-alpine AS base
RUN adduser ow_api_user --disabled-password
USER ow_api_user 
WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "OW.ApiSimulator.dll"]
