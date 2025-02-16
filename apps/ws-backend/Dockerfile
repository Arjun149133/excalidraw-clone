FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build --filter "./packages/**"

RUN pnpm build --filter ws-backend

RUN cd packages/db && pnpm prisma generate

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=base /app/apps/ws-backend/dist ./dist
COPY --from=base /app/apps/ws-backend/package.json ./
COPY --from=base /app/packages/db/node_modules/@prisma ./node_modules/@prisma
COPY --from=base /app/packages/db/node_modules/prisma ./node_modules/prisma
COPY --from=base /app/packages/db/node_modules/@prisma/client ./node_modules/@prisma/client

RUN pnpm install

EXPOSE 8080

CMD ["pnpm", "start"]