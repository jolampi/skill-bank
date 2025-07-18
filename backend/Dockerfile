FROM mcr.microsoft.com/dotnet/sdk:9.0 AS develop
WORKDIR /app
EXPOSE 5268
ENV DOTNET_URLS=http://+:5268

COPY . .
RUN dotnet restore \
    && dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

CMD ["dotnet", "watch", "run", "--non-interactive", "--project", "SkillBank"]
