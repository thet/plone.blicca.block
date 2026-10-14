UV ?= uv
UVX ?= uvx


.PHONY: build
build:
	$(MAKE) -C "./resources/" build


.PHONY: test
test:
	$(MAKE) -C "./resources/" test
	$(UV) run --extra test pytest -v


.PHONY: format
format:
	$(MAKE) -C "./resources/" lint
	$(MAKE) -C "./resources/" format
	$(UVX) pre-commit run --all-files
