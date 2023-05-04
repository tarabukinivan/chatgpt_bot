```
git clone https://github.com/tarabukinivan/chatgpt_bot
cd chatgpt_bot

nano config/production.json
```
заполняем
```
{
    "TELEGRAM_TOKEN": "телеграм токен",
    "OPENAI_KEY": "токен open.ai"    
}
```

билдим и запускаем
```
docker build -t chatgpt  .
docker run -d --name chatgpt  chatgpt
```
удаление

```
docker stop chatgpt
docker rm chatgpt
docker rmi chatgpt

удалить папку
rm -rf chatgpt_bot
```

utils
docker exec -it chatgpt /bin/sh - вход в контейнер
