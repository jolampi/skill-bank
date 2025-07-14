#!/bin/sh

docker compose run --rm backend dotnet ef database update --project SkillBank
