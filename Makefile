.PHONY: help clean build serve test deploy docker-build docker-serve docker-clean

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build Docker image (cleans build artifacts automatically)"
	@echo "  serve      - Start development server in Docker"
	@echo "  clean      - Clean everything including Docker cache and local artifacts"
	@echo "  deep-clean - Remove everything including the Docker image"
	@echo "  deploy     - Deploy to GitHub Pages (git push)"

# Deploy to GitHub Pages
deploy:
	@echo "Deploying to GitHub Pages..."
	@echo "Pushing changes to main branch..."
	git add .
	git commit -m "Deploy: $(shell date -u +'%Y-%m-%d %H:%M:%S UTC')" || true
	git push origin main
	@echo "Deployment initiated. Check GitHub Actions for build status."

# Docker commands
build:
	@echo "Building Docker image..."
	DOCKER_BUILDKIT=1 docker build --cache-from jekyll-arm -t jekyll-arm .
	@echo "Cleaning build artifacts..."
	@docker builder prune -f

serve:
	@echo "Starting Jekyll server in Docker..."
	@echo "Visit http://localhost:4000"
	docker run --rm -it \
		-p 4000:4000 \
		-u $$(id -u):$$(id -g) \
		-e HOME=/tmp \
		-e BUNDLE_PATH=/site/vendor/bundle \
		-e BUNDLE_APP_CONFIG=/site/.bundle \
		-e GEM_HOME=/site/vendor/bundle \
		-v "$$PWD":/site \
		-w /site \
		jekyll-arm \
		bash -lc "mkdir -p /site/vendor/bundle /site/.bundle && bundle install && bundle exec jekyll serve --livereload --host 0.0.0.0 --baseurl ''"

clean:
	@echo "Cleaning everything including Docker image cache..."
	docker image prune -af
	docker builder prune -af
	docker container prune -f
	docker system prune -af
	@echo "Removing local build artifacts..."
	rm -rf _site .jekyll-cache .bundle vendor

# Kill any existing Jekyll servers
kill-server:
	@echo "Killing existing Jekyll servers..."
	@docker ps -q --filter "publish=4000" | xargs -r docker stop || true
	@lsof -ti:4000 | xargs -r kill -9 || true

# Deep clean - removes everything including the Docker image
deep-clean: clean
	@echo "Removing Docker image..."
	docker rmi jekyll-arm || true
	@echo "Deep clean completed!"

