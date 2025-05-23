FROM mcr.microsoft.com/dotnet/sdk:9.0 as develop
WORKDIR /app
EXPOSE 5268
ENV DOTNET_URLS=http://+:5268

RUN adduser --uid 1001 --disabled-password --gecos "" appuser \
    && chown --recursive appuser /app
USER appuser

COPY --chown=appuser . .
RUN dotnet restore

CMD ["dotnet", "watch", "run", "--project", "SkillBank"]

FROM mcr.microsoft.com/dotnet/sdk:9.0 as migrate
WORKDIR /app

COPY . .
RUN dotnet restore \
    && dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

CMD [ "dotnet", "ef", "database", "update", "--project", "SkillBank" ]
