FROM mcr.microsoft.com/dotnet/sdk:9.0@sha256:3fcf6f1e809c0553f9feb222369f58749af314af6f063f389cbd2f913b4ad556 AS base

FROM base AS dependencies
WORKDIR /app
COPY . .
RUN dotnet restore

FROM dependencies AS develop
WORKDIR /app
EXPOSE 5268
ENV DOTNET_URLS=http://+:5268
CMD ["dotnet", "watch", "run", "--non-interactive", "--project", "SkillBank"]

FROM develop AS migrate
WORKDIR /app/SkillBank
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet ef migrations bundle
CMD [ "./efbundle"]

FROM dependencies AS build
WORKDIR /app
RUN dotnet publish SkillBank --output out

FROM mcr.microsoft.com/dotnet/aspnet:9.0@sha256:b4bea3a52a0a77317fa93c5bbdb076623f81e3e2f201078d89914da71318b5d8 AS production
WORKDIR /app
RUN adduser --uid 1001 --disabled-password --gecos "" dotnet
COPY --from=build --chown=dotnet /app/out .
USER dotnet
EXPOSE 5268
ENV DOTNET_URLS=http://+:5268
ENTRYPOINT ["dotnet", "SkillBank.dll"]
