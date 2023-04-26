build:
	docker build -t boty .

run:
	docker run -d -p 7777:7777 --name boty --rm boty