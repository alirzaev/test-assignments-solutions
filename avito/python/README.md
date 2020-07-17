# Решение тестового задания для backend-разработчиков от avito.ru

Решение [тестового задания](https://github.com/avito-tech/verticals/blob/master/trainee/backend.md) для backend-разработчиков от [avito](https://avito.ru/)

## Запуск

```shell script
export FLASK_ENV=production
export DATABASE_URI="postgres://user:password@localhost:5432/database"

python manage.py db upgrade # применение миграций
python manage.py runserver # запуск сервера
```