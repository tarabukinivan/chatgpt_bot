build:
	docker build -t chatgpt  .

run:
	docker run -d --name chatgpt  chatgpt
