FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build --filter "./packages/**"

RUN pnpm build --filter excalidraw-fe

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Copy necessary files from build stage
COPY --from=base /app/apps/excalidraw-fe/.next ./.next
COPY --from=base /app/apps/excalidraw-fe/package.json ./package.json
COPY --from=base /app/apps/excalidraw-fe/public ./public

RUN pnpm install

EXPOSE 3000

CMD ["npm", "start"]