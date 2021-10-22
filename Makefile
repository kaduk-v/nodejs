up: docker-up
restart: docker-down docker-up
down: docker-down
init: docker-down-clear docker-build docker-up db-data-init

docker-up:
	docker-compose up -d
docker-build:
	docker-compose build --no-cache
docker-stop:
	docker-compose stop
docker-down:
	docker-compose down --remove-orphans
docker-down-clear:
	docker-compose down -v --remove-orphans
db-data-init:
	docker-compose exec db node init
