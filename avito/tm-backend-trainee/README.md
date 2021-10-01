# Решение тестового задания для backend-разработчиков от avito.ru

Решение [тестового задания](https://github.com/avito-tech/tm-backend-trainee) для backend-разработчиков от [avito](https://avito.ru/)

## Запуск

```shell script
python manage.py migratse
python manage.py runserver

# или

docker-compose up
```

## Документация

### Метод сохранения статистики.

Запрос:
```http
POST http://localhost:8000/stats/save/ HTTP/1.1
Content-Type: application/json

{
    "date": "2021-09-30",
    "clicks": 5,
    "views": 10,
    "cost": 10.50
}
```

Ответ:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 11

{
    "ok": true
}
```

### Метод показа статистики

Запрос:
```http
GET http://localhost:8000/stats/show/?from=2021-09-29&to=2021-09-30 HTTP/1.1
```

Параметры **query string**:

- `from` - дата начала периода (включительно), формат: `YYYY-MM-DD`

- `to` - дата окончания периода (включительно), формат: `YYYY-MM-DD`

Ответ:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 189

{
    "ok": true,
    "stats": [
        {
            "date": "2021-09-29",
            "views": 10,
            "clicks": 50,
            "cost": "100.50",
            "cpc": 2.01,
            "cpm": 10050.0
        },
        {
            "date": "2021-09-30",
            "views": 10,
            "clicks": 5,
            "cost": "10.50",
            "cpc": 2.1,
            "cpm": 1050.0
        }
    ]
}
```

 
### Метод сброса статистики

Запрос:
```http
PUT http://localhost:8000/stats/reset/ HTTP/1.1
```

Ответ:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 11

{
    "ok": true
}
```