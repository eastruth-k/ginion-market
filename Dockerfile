FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive
ARG NODE_MAJOR=22
ARG CODEX_VERSION=0.154.0-alpha.6.2

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        gnupg \
        nginx \
        supervisor \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && curl -fsSL https://pgp.mongodb.com/server-8.0.asc \
        | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg \
    && echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" \
        > /etc/apt/sources.list.d/mongodb-org-8.0.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs mongodb-org \
    && npm install --global "@openai/codex@${CODEX_VERSION}" \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash nodeapp

WORKDIR /app

COPY . .

RUN npm ci \
    && BETTER_AUTH_SECRET=docker-build-placeholder-secret-at-least-32-characters npm run build \
    && npm cache clean --force \
    && chown -R nodeapp:nodeapp /app

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/ginion-market.conf
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && rm -f /etc/nginx/sites-enabled/default

ENV NODE_ENV=production \
    MONGODB_URI=mongodb://127.0.0.1:27017 \
    MONGODB_DB=daepa_market \
    BETTER_AUTH_URL=http://localhost:3000 \
    CODEX_HOME=/home/nodeapp/.codex

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
    CMD curl --fail --silent --show-error http://127.0.0.1:3000/ > /dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
