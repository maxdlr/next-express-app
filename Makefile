#debug flags:
#a for all debugging (same as make -d and make --debug).
#b for basic debugging.
#v for slightly more verbose basic debugging.
#i for implicit rules.
#j for invocation information.
#m for information during makefile remakes.
MAKEFLAGS += --no-print-directory
#MAKEFLAGS += --debug=v
# MAKEFLAGS += -s
# include .env
# export $(shell sed 's/=.*//' .env)
#default: help
.DEFAULT_GOAL := help
#.PHONY: all

pt: ## Run Posting with the project request collection
	posting --collection ./request-collection

db: ## Run mongotui
	mongotui localhost

db-drop: ## Drop database
	mongosh gedeonDB --eval "db.dropDatabase()"

install-mongotui: ## Install mongotui
	sudo curl -OL https://github.com/kreulenk/mongotui/releases/download/v1.6.0/mongotui-linux-amd64.tar.gz
	tar -xzvf mongotui-linux-amd64.tar.gz
	sudo mv ./mongotui /usr/local/bin/mongotui

back-run: ## Run back app
	make db-drop && cd back && DEBUG=back:* npm start

front-run: ## run front app
	cd front && npm install && ng serve --host 0.0.0.0

run: ## Run all services
	make -j2 back-run front-run

help: ## This menu
	@echo "Usage: make [target]"
	@echo
	@echo "Available targets:"
	@echo
	@echo "---------- $(PRIMARY_COLOR)App commands$(END_COLOR)"
	@awk -F ':|##' '/^app-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
	@echo
	@echo "---------- $(PRIMARY_COLOR)Backend commands$(END_COLOR)"
	@awk -F ':|##' '/^back-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
	@echo
	@echo "---------- $(PRIMARY_COLOR)Frontend commands$(END_COLOR)"
	@awk -F ':|##' '/^front-.*?:.*?##/ && !/##hidden/ {printf "$(SUCCESS_COLOR)%-30s$(END_COLOR) %s\n", $$1, $$NF}' $(MAKEFILE_LIST) | sort
