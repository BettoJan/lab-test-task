# NestJs Api

* Для начала нужно переименовать файл .env.template в .env и заполнить его данными, которых не хватает
* Далее выполняем:
```
docker-compose -f docker-compose.yml up --no-start
```
```
docker-compose -f docker-compose.yml start
```
После этого у нас поднимаются 2 контейнера:
mail:   nestjs приложение;
postgres: бд


е2е тесты:
```
npm run test:e2e
```




Если что-то не работает, пишите в телеграм @bettoqo



