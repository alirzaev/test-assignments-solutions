#!/usr/bin/env sh

set -e

# wait for db to be initialized
sleep 5

python manage.py migrate

exec "$@"