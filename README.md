# GitHub Projects Showcase

This repository contains the source code for my GitHub Pages site that automatically showcases my open source projects and public GitHub repositories.

## 🎯 Purpose

Since I have an official personal website at [dongchankim.io](https://dongchankim.io), this GitHub Pages site serves as a dedicated showcase for my open source work and public code repositories. The site automatically fetches and displays all my public GitHub repositories using the GitHub API.

## ✨ Features

### **Dynamic Repository Integration**
- **Automatic Fetching**: Real-time repository data from GitHub API
- **Smart Organization**: Repositories grouped by programming language
- **Rich Metadata**: Stars, forks, topics, descriptions, and update dates
- **Statistics Dashboard**: Overview of total repos, stars, forks, and languages
- **Always Current**: No manual updates needed when adding new repositories
- **Single Page Design**: Everything in one comprehensive page

### **Professional Design**
- **Responsive Layout**: Mobile-friendly design with CSS Grid
- **Modern UI**: Clean cards with hover effects and smooth transitions
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Accessibility**: Proper semantic HTML and keyboard navigation

### **Technical Features**
- **Jekyll-based**: Built with Jekyll and the minima theme
- **GitHub Pages Ready**: Optimized for GitHub Pages deployment
- **Performance**: Efficient API calls with proper error handling
- **SEO Optimized**: Structured data and meta tags

## 🏗️ Architecture

```
├── index.md              # Single-page website with dynamic GitHub repos
├── _config.yml           # Jekyll configuration
├── _sass/custom.scss     # Custom styling and components
├── _includes/head.html   # Custom head includes (favicon, meta tags)
├── Gemfile               # Ruby dependencies
├── Makefile              # Simplified Docker development commands
└── Dockerfile            # Containerized development environment
```

## 🚀 Quick Start

### **Option 1: Local Development (Recommended)**

```bash
# Install Ruby and Jekyll dependencies
bundle install

# Start local development server
bundle exec jekyll serve --livereload

# Visit http://localhost:4000
```

### **Option 2: Docker Development (Simplified)**

```bash
# Show all available commands
make help

# Start development server (automatically builds if needed)
make serve

# Individual commands
make build    # Build Docker image
make clean    # Clean up Docker resources
make deploy   # Deploy to GitHub Pages
```

### **Option 3: GitHub Pages (Automatic)**

The site automatically deploys when you push to the `main` branch. GitHub Pages will:
1. Detect the Jekyll site
2. Install dependencies from `Gemfile`
3. Build and deploy to `dongchankim-io.github.io`

## 🛠️ Development

### **Prerequisites**
- Ruby 3.0+ (for local development)
- Docker (for containerized development)
- Git

### **Local Setup**
```bash
# Clone the repository
git clone https://github.com/dongchankim-io/dongchankim-io.github.io.git
cd dongchankim-io.github.io

# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve --livereload
```

### **Customization**

#### **Modifying Repository Display**
Edit the JavaScript section in `index.md` to customize how repositories are fetched and displayed.

#### **Styling Changes**
Modify `_sass/custom.scss` to customize colors, layouts, and animations.

#### **Configuration Updates**
Edit `_config.yml` to change site metadata, navigation, and build settings.

### **Testing**
```bash
# Build the site
bundle exec jekyll build

# Check for build errors
bundle exec jekyll build --safe

# Validate HTML (optional)
bundle exec htmlproofer ./_site
```

## 🔧 Configuration

### **GitHub API Integration**
The site automatically fetches repositories from:
- **API Endpoint**: `https://api.github.com/users/dongchankim-io/repos`
- **Filtering**: Excludes forks and the current repository
- **Sorting**: By last updated date
- **Limit**: Up to 100 repositories

### **Jekyll Settings**
- **Theme**: minima (GitHub Pages compatible)
- **Markdown**: kramdown with GitHub Flavored Markdown
- **Collections**: Projects collection for future expansion
- **Plugins**: SEO tags, sitemap, and redirects

## 📱 Deployment

### **GitHub Pages**
1. Push changes to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site available at `https://dongchankim-io.github.io`

### **Custom Domain (Optional)**
To use `works.dongchankim.io`:
1. Add `CNAME` file with your domain
2. Configure DNS records
3. Update `_config.yml` with new URL

### **Manual Deployment**
```bash
# Build for production
bundle exec jekyll build

# Deploy to any static hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🔍 Troubleshooting

### **Common Issues**

#### **GitHub API Rate Limits**
- The site uses unauthenticated API calls (60 requests/hour limit)
- For higher limits, consider adding GitHub token authentication

#### **Build Errors**
```bash
# Clear Jekyll cache
bundle exec jekyll clean

# Reinstall dependencies
bundle install

# Check Ruby version compatibility
ruby --version
```

#### **Docker Issues**
```bash
# Reset Docker environment
make clean
make build
make serve
```

## 📋 Makefile Commands

The project includes a simplified Makefile for common development tasks:

### **Available Commands**
```bash
make help    # Show all available commands
make build   # Build Docker image
make serve   # Start development server in Docker
make clean   # Clean Docker resources
make deploy  # Deploy to GitHub Pages
```

### **Command Details**
- **`make help`**: Displays all available make commands with descriptions
- **`make build`**: Builds the Docker image for development
- **`make serve`**: Starts the Jekyll development server in Docker
- **`make clean`**: Cleans up Docker images and build cache
- **`make deploy`**: Commits changes and pushes to GitHub for deployment

### **Performance Optimization**
- Repository data is fetched client-side for real-time updates
- CSS and JavaScript are minified in production
- Images and assets are optimized for web delivery

## 🤝 Contributing

While this is a personal showcase site, I welcome suggestions for:
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements
- New features

Please open an issue or discussion for any suggestions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Site**: [dongchankim-io.github.io](https://dongchankim-io.github.io)
- **GitHub Profile**: [github.com/dongchankim-io](https://github.com/dongchankim-io)
- **Personal Website**: [dongchankim.io](https://dongchankim.io)
- **Blog**: [blog.dongchankim.io](https://blog.dongchankim.io)

---

*Built with ❤️ using Jekyll, GitHub Pages, and the GitHub API*