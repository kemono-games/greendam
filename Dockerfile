FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ bash 
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]