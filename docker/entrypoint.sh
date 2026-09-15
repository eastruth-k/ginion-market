#!/usr/bin/env bash
set -euo pipefail

mkdir -p /var/lib/mongodb /var/log/mongodb /run/nginx
chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb

if [[ -d /home/nodeapp/.codex ]]; then
    chown nodeapp:nodeapp /home/nodeapp
fi

exec "$@"
