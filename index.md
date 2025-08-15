---
layout: page
permalink: /
---

<div class="hero">
  <h1>Dongchan (<span class="alt-name">Don</span>) Kim</h1>
  <p class="tagline">Open Source Projects & Code Showcase</p>
  <p class="meta">AI/ML • Search & Recommendations • Real-time Systems</p>

  <p class="blurb">
    Welcome to my GitHub projects showcase! This page highlights my open source contributions and public repositories
    focused on AI/ML, large-scale systems, and real-time decisioning.
  </p>

  <div class="chips">
    <span class="chip">AI</span>
    <span class="chip">MachineLearning</span>
    <span class="chip">GenerativeAI</span>
    <span class="chip">LLM</span>
    <span class="chip">NLP</span>
    <span class="chip">ComputerVision</span>
    <span class="chip">RecommenderSystems</span>


  </div>
</div>

<section id="projects" class="projects-section">
  <h2>Open Source Projects</h2>
  <p class="section-description">
    This section automatically fetches and displays all my public GitHub repositories. Each project includes source code, documentation, and metadata directly from GitHub.
  </p>

  <div id="repositories-loading" class="loading-state">
    <p>Loading repositories from GitHub...</p>
  </div>

  <div id="repositories-container" class="repositories-grid" style="display: none;">
    <!-- Repositories will be populated here dynamically -->
  </div>

  <div id="repositories-error" class="error-state" style="display: none;">
            <p>Unable to load repositories. Please visit my <a href="https://github.com/dongchankim-io" class="github-profile-link">GitHub profile</a> directly.</p>
  </div>
</section>

<section class="contact-section">
  <h2>Get in Touch</h2>
  <div class="contact-grid">
    <div class="contact-item">
      <h3>🌐 Personal Website</h3>
      <p><a href="https://dongchankim.io">dongchankim.io</a></p>
    </div>
    <div class="contact-item">
      <h3>📚 GitHub</h3>
      <p><a href="https://github.com/dongchankim-io" class="github-profile-link">github.com/dongchankim-io</a></p>
    </div>
    <div class="contact-item">
      <h3>📧 Email</h3>
      <p><a href="mailto:dongchan@dongchankim.io">dongchan@dongchankim.io</a></p>
    </div>
    <div class="contact-item">
      <h3>💬 Blog</h3>
      <p><a href="https://blog.dongchankim.io">blog.dongchankim.io</a></p>
    </div>
  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const username = 'dongchankim-io';
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
  
  const loadingEl = document.getElementById('repositories-loading');
  const containerEl = document.getElementById('repositories-container');
  const errorEl = document.getElementById('repositories-error');
  
  // Fetch repositories from GitHub API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then(repositories => {
      // Filter out this repository (dongchankim-io.github.io) and forks
      const filteredRepos = repositories.filter(repo => 
        repo.name !== 'dongchankim-io.github.io' && !repo.fork
      );
      
      if (filteredRepos.length === 0) {
        containerEl.innerHTML = `
          <div class="no-repos">
            <h3>No Public Repositories Found</h3>
            <p>It looks like you don't have any public repositories yet, or they might be forks.</p>
            <p>Check out my <a href="https://github.com/dongchankim-io" target="_blank" rel="noopener" class="github-profile-link">GitHub profile</a> for more projects.</p>
          </div>
        `;
      } else {
        // Add repository statistics
        const stats = calculateStats(filteredRepos);
        const statsHtml = createStatsSection(stats);
        
        // Group repositories by primary language
        const groupedRepos = groupRepositoriesByLanguage(filteredRepos);
        containerEl.innerHTML = statsHtml + renderRepositories(groupedRepos);
      }
      
      loadingEl.style.display = 'none';
      containerEl.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
    });
  
  function calculateStats(repos) {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
    const totalSize = repos.reduce((sum, repo) => sum + (repo.size || 0), 0);
    
    return {
      totalRepos: repos.length,
      totalStars,
      totalForks,
      languages: languages.length,
      totalSize: Math.round(totalSize / 1024) // Convert to MB
    };
  }
  
  function createStatsSection(stats) {
    return `
      <div class="stats-section">
        <h3>📊 Repository Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${stats.totalRepos}</span>
            <span class="stat-label">Repositories</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.totalStars}</span>
            <span class="stat-label">Total Stars</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.totalForks}</span>
            <span class="stat-label">Total Forks</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${stats.languages}</span>
            <span class="stat-label">Languages</span>
          </div>
        </div>
      </div>
    `;
  }
  
  function groupRepositoriesByLanguage(repos) {
    const groups = {};
    
    repos.forEach(repo => {
      const language = repo.language || 'Other';
      if (!groups[language]) {
        groups[language] = [];
      }
      groups[language].push(repo);
    });
    
    // Sort groups by number of repositories
    return Object.entries(groups)
      .sort(([,a], [,b]) => b.length - a.length)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }
  
  function renderRepositories(groupedRepos) {
    let html = '';
    
    Object.entries(groupedRepos).forEach(([language, repos]) => {
      html += `<div class="language-section">`;
      html += `<h3 class="language-header">${getLanguageIcon(language)} ${language} (${repos.length})</h3>`;
      
      repos.forEach(repo => {
        html += createRepositoryCard(repo);
      });
      
      html += `</div>`;
    });
    
    return html;
  }
  
  function createRepositoryCard(repo) {
    const description = repo.description || 'No description available';
    const topics = repo.topics || [];
    const topicsHtml = topics.map(topic => 
      `<span class="topic-tag">${topic}</span>`
    ).join('');
    
    return `
      <div class="repository-card">
        <div class="repo-header">
          <h4 class="repo-name">
            <a href="${repo.html_url}" target="_blank" rel="noopener">
              ${repo.name}
            </a>
          </h4>
          ${repo.stargazers_count > 0 ? `<span class="stars">⭐ ${repo.stargazers_count}</span>` : ''}
        </div>
        
        <p class="repo-description">${description}</p>
        
        ${topicsHtml ? `<div class="repo-topics">${topicsHtml}</div>` : ''}
        
        <div class="repo-meta">
          <span class="repo-language">${repo.language || 'Other'}</span>
          <span class="repo-updated">Updated ${formatDate(repo.updated_at)}</span>
        </div>
        
        <div class="repo-links">
          <a href="${repo.html_url}" class="btn-small" target="_blank" rel="noopener">
            View on GitHub
          </a>
          ${repo.homepage ? `<a href="${repo.homepage}" class="btn-small" target="_blank" rel="noopener">Website</a>` : ''}
        </div>
      </div>
    `;
  }
  
  function getLanguageIcon(language) {
    const icons = {
      'Python': '🐍',
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Java': '☕',
      'C++': '⚡',
      'Go': '🐹',
      'Rust': '🦀',
      'Ruby': '💎',
      'PHP': '🐘',
      'C#': '💜',
      'Swift': '🍎',
      'Kotlin': '🟠',
      'Scala': '🔴',
      'R': '📊',
      'Julia': '🔮',
      'Other': '📁'
    };
    return icons[language] || '📁';
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
});
</script>