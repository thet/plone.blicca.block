PNPM ?= npx pnpm


.PHONY: install
install: node_modules/.install-stamp


node_modules/.install-stamp: package.json pnpm-lock.yaml
	$(PNPM) install
	touch $@


.PHONY: clean
clean:
	rm -Rf node_modules/


.PHONY: lint
lint: install
	$(PNPM) run lint


.PHONY: format
format: install
	$(PNPM) run format


.PHONY: test
test: install
	$(PNPM) run test


.PHONY: build
build: install
	$(PNPM) run build
