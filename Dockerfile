FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

FROM node:24-alpine AS execution

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S newuser -u 1001 -G nodejs && \
    chown -R newuser:nodejs /app

COPY --from=builder --chown=newuser:nodejs /app /app

USER newuser

EXPOSE 80

CMD ["npm", "start"]
