document.addEventListener('DOMContentLoaded', function () {
    const userDetailsContainer = document.getElementById('user-details');
    const userPostsContainer = document.getElementById('user-posts');
    const title = document.getElementById('title');
    // Holen der UserID aus der URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    //Erstellen eines Listener, damit auch hier das drücken des Textes im Header den Benutzer zurück auf die Startseite bringt
    title.addEventListener('click', function () {
        window.location.href = `Startseite.html`;
    });
    // API-Aufruf, um den Benutzernamen zu erhalten
    fetch(`https://dummyjson.com/users/${userId}`)
        .then(res => res.json())
        .then(userData => {
            const username = userData.username;
            // API-Aufruf, um die Posts des Users zu erhalten
            fetch(`https://dummyjson.com/posts/user/${userId}`)
                .then(res => res.json())
                .then(data => {
                    const userPosts = data.posts;
                    //Prüfen, ob ein User bereits Posts erstellt hat
                    if(userPosts.length>0){
                    //Posts anzeigen
                    const userDetailsHTML = `
                        <h2>Alle Posts von dem Nutzer ${username}</h2>
                        <div class="user-posts">
                            ${userPosts.map(post => createPostCard(post)).join('')}
                        </div>`;

                    userDetailsContainer.innerHTML = userDetailsHTML;
                    }
                    else{

                        const userDetailsHTML= `${username} hat bisher keine Posts erstellt`;
                        userDetailsContainer.innerHTML=userDetailsHTML;
                    }
                })
                //Fehlerbehandlung
                .catch(error => {
                    console.error("Fehler beim Abrufen der Benutzerdetails und Posts:", error);
                });
        })
        //Fehlerbehandlung
        .catch(error => {
            console.error("Fehler beim Abrufen des Benutzernamens:", error);
        });
});

//Erstellen der PostCards (Hier werden jeweils die einzelnen Post drinnen gespeichert)
function createPostCard(post) {
    return `
        <div class="post-card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `;
}
