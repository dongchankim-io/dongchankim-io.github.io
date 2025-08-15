# Build stage - install build tools and compile gems
FROM ruby:3.5-rc-slim AS builder

# Install system dependencies first (this layer rarely changes)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (these change less frequently)
COPY Gemfile Gemfile.lock ./

# Install gems (this layer is cached unless Gemfile changes)
RUN bundle install --jobs 4 --retry 3

# Runtime stage - only runtime dependencies
FROM ruby:3.5-rc-slim

# Install runtime dependencies including build tools for gem compilation (this layer rarely changes)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built gems from builder stage
COPY --from=builder /usr/local/bundle /usr/local/bundle

# Create user (this layer rarely changes)
RUN useradd -m -u 1000 app

# Set environment variables (this layer rarely changes)
ENV HOME=/home/app
ENV BUNDLE_PATH=/home/app/.bundle
ENV GEM_HOME=/home/app/.bundle

# Set working directory
WORKDIR /site

# Expose port
EXPOSE 4000

# Switch to non-root user
USER app

# Copy source code last (this changes most frequently)
COPY --chown=app:app . .

# No need to run bundle install again - gems are already installed
CMD ["bundle", "exec", "jekyll", "serve", "--livereload", "--host", "0.0.0.0", "--baseurl", ""]
