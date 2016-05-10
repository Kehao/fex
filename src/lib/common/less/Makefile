VERSION=0.1.0
DATE=$(shell DATE)
TARGET = ../common.css
TARGET_MIN = ../common.min.css
TARGET_LESS = ./common.less
LESS_COMPESSOR ?= `which lessc`
WATCHR ?= `which watchr`

build:
	@@if test ! -z ${LESS_COMPESSOR}; then \
		sed -e 's/@VERSION/'"v${VERSION}"'/' -e 's/@DATE/'"${DATE}"'/' <${TARGET_LESS} >${TARGET_LESS}.tmp; \
		lessc ${TARGET_LESS}.tmp > ${TARGET}; \
		rm -f ${TARGET_LESS}.tmp; \
		echo "Target successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build Bootstrap."; \
		echo "You can install it by running: npm install less -g"; \
	fi

watch:
	@@if test ! -z ${WATCHR}; then \
	  echo "Watching less files..."; \
	  watchr -e "watch('.*\.less') { system 'make' }"; \
	else \
		echo "You must have the watchr installed in order to watch Bootstrap less files."; \
		echo "You can install it by running: gem install watchr"; \
	fi

.PHONY: build watch
