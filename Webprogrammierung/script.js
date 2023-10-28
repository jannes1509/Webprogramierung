class Router {
    constructor(routes) {
        this._routes = routes;
        this._started = false;

        window.addEventListener("hashchange", () => this._handleRouting());
    }

    start() {
        this._started = true;
        this._handleRouting();
    }

    stop() {
        this._started = false;
    }

    _handleRouting() {
        let url = location.hash.slice(1);

        if (url.length === 0) {
            url = "/";
        }

        let matches = null;
        let route = this._routes.find(p => matches = url.match(p.url));

        if (!route) {
            console.error(`Keine Route zur URL ${url} gefunden!`);
            return;
        }

        route.show(matches);
    }
}

function formatieren(input) {
    if (input && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
}
function startseiteLaden() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    document.getElementById("search-button").addEventListener("click", function () {
        const city= formatieren(document.getElementById("search").value);
        //Prüfen, ob eine Stadt eingeben wurde
        if (city) {
            const apiUrl = `https://dummyjson.com/users/filter?key=address.city&value=${city}`;

            //API-Aufruf
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const users = data.users;
                    //Prüfen, ob in der Stadt User vorhanden sind
                    if (users.length > 0) {
                        const resultContainer = document.getElementById("result");
                        resultContainer.innerHTML = "";
                        //Erstellen der Usercard für jeden einzelnen User
                        users.forEach(user => {
                            const userCard = document.createElement("div");
                            userCard.classList.add("user-card");

                            const userName = document.createElement("h2");
                            userName.textContent = `${user.firstName} ${user.lastName}`;
                            userCard.appendChild(userName);

                            //Hinzufügen des Details Button, über den auf die Detail Website zugegriffen werden kann
                            const detailsButton = document.createElement("button");
                            detailsButton.classList.add("details-button");
                            detailsButton.textContent = "Details";

                            // FHinzufügen der User ID, damit diese später direkt in die URl übergeben werden kann und somit die Detailseite geöffnet werden kann
                            detailsButton.setAttribute("data-user-id", user.id);

                            userCard.appendChild(detailsButton);
                            resultContainer.appendChild(userCard);
                        });

                        // Ausgabe eines Fehler, wenn es in der Stadt keine User gibt
                    } else {
                        const resultContainer = document.getElementById("result");
                        resultContainer.innerHTML = "<p>Keine Benutzer gefunden.</p>";
                    }
                })
                //Fehlerbehandlung
                .catch(error => {
                    console.error("Fehler beim Abrufen der Daten:", error);
                });
        } else {
            const resultContainer = document.getElementById("result");
            resultContainer.innerHTML = "<p>Geben sie eine Stadt ein, um Benutzer anzuzeigen. Wenn sie eine Stadt eingegeben haben, in der User registriert sind, dann erhalten sie die Möglichkeit alle Posts dieser User zu sehen. Besonders aktiv sind User in größeren Städten, wie zum Beispiel Manchester oder Washington</p>";
        }
    });

    // Erstellen des Listener für den Details Button, der auf die neue Detal Seite weiterleiten soll
    document.getElementById('result').addEventListener('click', function (event) {
        if (event.target && event.target.className === 'details-button') {
            const userId = event.target.getAttribute('data-user-id');
            showDetails(userId);
        }
    });
}
// Abruf der Detailansicht für die spezifische User ID 
function showDetails(userId) {
    // Erstellen der individuellen URL für den User auf der Detailseite
    window.location.href = `#/detail/${userId}`;
}

//Erstellen weiterer Listener für die Suche, die Ergebnisse und den Titel

function detailseiteLaden() {

    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resultBox = document.getElementById('result');
    const title = document.getElementById('title');
    const userDetailsContainer = document.getElementById('user-details');
    const userPostsContainer = document.getElementById('user-posts');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const url = window.location.href;
    const regex = /detail\/(.*)/;
    const match = regex.exec(url);
    const number = match[1];

    // Wenn man auf den Text Post@Data klickt, wird die Suchleiste geleert, um wieder die leere Startseite zu simulieren
    title.addEventListener('click', function () {
        title.href = `#/detail`
    });


    fetch(`https://dummyjson.com/users/${number}`)
    .then(res => res.json())
    .then(userData => {
        const username = userData.username;
        // API-Aufruf, um die Posts des Users zu erhalten
        fetch(`https://dummyjson.com/posts/user/${number}`)
            .then(res => res.json())
            .then(data => {
                const userPosts = data.posts;
                // Prüfen, ob ein User bereits Posts erstellt hat
                if (userPosts.length > 0) {
                    // Posts anzeigen
                    const userDetailsHTML = `
                        <h2>Alle Posts von dem Nutzer ${username}</h2>
                        <div class="user-posts">
                            ${userPosts.map(post => createPostCard(post)).join('')}
                        </div>`;

                    userDetailsContainer.innerHTML = userDetailsHTML;
                } else {
                    const userDetailsHTML = `${username} hat bisher keine Posts erstellt`;
                    userDetailsContainer.innerHTML = userDetailsHTML;
                }

                // Hinzufügen von Kommentar-Buttons zu jedem Post
                userPosts.forEach(post => {
                    const commentButton = document.createElement('button');
                    commentButton.classList.add("details-button");
                    commentButton.innerText = 'Kommentare anzeigen';
                    commentButton.addEventListener('click', () => kommentareZeigen(post.id));
                    const postCard = document.querySelector(`#post-${post.id}`);
                    postCard.appendChild(commentButton);
                });
            })
            // Fehlerbehandlung
            .catch(error => {
                console.error("Fehler beim Abrufen der Benutzerdetails und Posts:", error);
            });
    })
    // Fehlerbehandlung
    .catch(error => {
        console.error("Fehler beim Abrufen des Benutzernamens:", error);
    });

}
function kommentareZeigen(postId)
{
    window.location.href = `#/kommentare/${postId}`;
}

function kommentarseiteLaden()
{
    const url = window.location.href;
    const regex = /kommentare\/(.*)/;
    const match = regex.exec(url);
    const postId = match[1];
    showPostComments(postId);

}
function createPostCard(post) {
    return `
        <div class="post-card" id="post-${post.id}">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
        </div>
    `;
}
function showPostComments(postId) {
    console.log("test1");
    const userDetailsContainer = document.getElementById('user-details2');
    // API-Aufruf, um Kommentare für einen bestimmten Post abzurufen
    fetch(`https://dummyjson.com/comments/post/${postId}`)
        .then(res => res.json())
        .then(data => {
            const comments = data.comments;
            console.log(comments);
            // Hier erstellen wir ein HTML-Element für Kommentare und füllen es mit den Kommentaren
            const commentsHTML = `
                <h2>Kommentare für Post #${postId}</h2>
                <div class="comments">
                    ${comments.map(comment => createCommentCard(comment)).join('')}
                </div>
            `;
            // Hier fügen wir das HTML-Element für Kommentare in die Seite ein
            userDetailsContainer.innerHTML = commentsHTML;
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Kommentare:", error);
        });
}

function createCommentCard(comment) {
    return `
        <div class="comment-card">
            <p><strong>Kommentar des Users: ${comment.user.username}</strong></p>
            <p>${comment.body}</p>
        </div>
    `;
}


window.addEventListener("load", () => {
    let swapContent = (id, title) => {
        document.querySelectorAll("main").forEach(mainElement => {
            mainElement.classList.add("hidden");
        })

        let element = document.querySelector(`#${id}`);
        if (element) element.classList.remove("hidden");

    }

    let routes = [
        {
            url: "^/$",
            show: () => {
                startseiteLaden();
                swapContent("startseite");
            },
        },
        {
            url: /^\/detail\/(.*)/,
            show: () => {
                detailseiteLaden();
                swapContent("detailseite");
            },
        },
        {
            url: /^\/kommentare\/(.*)/,
            show: () => {
                kommentarseiteLaden();
                swapContent("kommentarseite");
            },
        }

    ];

    let router = new Router(routes);
    router.start();
});

