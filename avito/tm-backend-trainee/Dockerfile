FROM python:3.9
EXPOSE 80

WORKDIR /usr/src/project

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --no-input

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD gunicorn -b 0.0.0.0:80 avito.wsgi:application