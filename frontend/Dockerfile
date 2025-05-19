FROM node:22-alpine
WORKDIR /app
EXPOSE 3000

RUN adduser --uid 1001 --disabled-password --gecos "" appuser \
    && chown --recursive appuser /app
USER appuser

COPY --chown=appuser . .
RUN npm ci

CMD ["npm", "run", "dev"]
