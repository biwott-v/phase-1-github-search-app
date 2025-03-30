// js/index.js
document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchInput = document.getElementById('search');

    githubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            searchUsers(searchTerm);
            reposList.innerHTML = ''; // Clear previous repos
        }
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => showError('Error searching users: ' + error));
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar">
                <div>
                    <h3>${user.login}</h3>
                    <a href="${user.html_url}" target="_blank">View Profile</a>
                </div>
            `;
            userItem.addEventListener('click', () => getRepositories(user.login));
            userList.appendChild(userItem);
        });
    }

    function getRepositories(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(repos => displayRepos(repos))
        .catch(error => showError('Error fetching repositories: ' + error));
    }

    function displayRepos(repositories) {
        reposList.innerHTML = '';
        repositories.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <div class="repo-card">
                    <h4>${repo.name}</h4>
                    ${repo.description ? `<p>${repo.description}</p>` : ''}
                    <div class="repo-meta">
                        <span> ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <a href="${repo.html_url}" target="_blank">View Repository</a>
                    </div>
                </div>
            `;
            reposList.appendChild(repoItem);
        });
    }

    function showError(message) {
        console.error(message);
        userList.innerHTML = `<li class="error">${message}</li>`;
    }
});
