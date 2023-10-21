document.addEventListener('DOMContentLoaded', function () {
    const userDetailsContainer = document.getElementById('user-details');
    const userPostsContainer = document.getElementById('user-posts');
    
    // Holen der UserID aus der URL-Query
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    // API-Aufruf, um den Benutzernamen zu erhalten
    fetch(`https://dummyjson.com/users/${userId}`)
        .then(res => res.json())
        .then(userData => {
            const username = userData.username;

            // Über die API die Posts des Benutzers abrufen
            fetch(`https://dummyjson.com/posts/user/${userId}`)
                .then(res => res.json())
                .then(data => {
                    const userPosts = data.posts;

                    // Benutzerdetails und Posts anzeigen
                    const userDetailsHTML = `
                        <h2>Alle Posts von dem Nutzer ${username}</h2>
                        <div class="user-posts">
                            ${userPosts.map(post => createPostCard(post)).join('')}
                        </div>`;

                    userDetailsContainer.innerHTML = userDetailsHTML;
                })
                .catch(error => {
                    console.error("Fehler beim Abrufen der Benutzerdetails und Posts:", error);
                });
        })
        .catch(error => {
            console.error("Fehler beim Abrufen des Benutzernamens:", error);
        });
});

function createPostCard(post) {
    return `
        <div class="post-card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `;
}
