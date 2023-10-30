/* 
    Die Klasse Router wurde 1:1 aus den Vorlesungsmaterialien übernommen. Sie kümmert sich dabei darum, dass das routing zwischen den
    verschiedenen Seiten funktioniert und die richtigen Routen verwendet werden.
*/

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

/*  
    Die Funktion formatieren kümmert sich darum, dass der Input, der in die Search Bar kommt, auf einen einheitlichen Standard gebracht wird.
    Dies meint, dass der erste Buchstabe immer groß ist und die nachfolgenden alle klein. Dadurch sollen auch Eingaben, wie z.B. washington
    oder WaShInGtoN, akzeptiert werden.
*/

function formatieren(input) {
    if (input && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
}

/*
    Diese Funktion implementiert die Funktion der Startseite, die es Benutzern ermöglicht, nach Benutzern in einer bestimmten Stadt zu suchen
    und Details zu diesen Benutzern anzuzeigen. 
    Beim Laden der Startseite wird die Funktion startseiteLaden() aufgerufen, die mehrere Event-Listener und Funktionen initialisiert.
    Zu Beginn werden Referenzen auf das HTML-Formularelement für die Sucheingabe und den Suchbutton geholt. 
    Ein Event-Listener wird dem Sucheingabefeld hinzugefügt, um auf Tastatureingaben zu reagieren. Wenn die Eingabetaste gedrückt wird, 
    wird die Suche ausgelöst. Ein weiterer Event-Listener wird dem Suchbutton hinzugefügt, um auf Klicks zu reagieren.
    Im Klick-Event-Handler für den Suchbutton wird der eingegebene Suchbegriff (die Stadt) formatiert und eine API-URL erstellt,
    um Benutzerdaten für diese Stadt abzurufen. Die fetch-Methode ruft die API auf, konvertiert die Daten in JSON und verarbeitet sie. 
    Wenn Benutzerdaten gefunden werden, werden Benutzerkarten erstellt und im HTML-Dokument angezeigt. 
    Jede Benutzerkarte enthält den Namen des Benutzers und einen "Details"-Button. Wenn keine Benutzer gefunden werden, 
    wird eine Fehlermeldung ausgegeben.
    Der zweite Event-Listener reagiert auf Klicks auf die "Details"-Buttons in den Benutzerkarten.
    Wenn ein Benutzer auf einen "Details"-Button klickt, wird die Funktion showDetails(userId) aufgerufen, 
    um auf eine Detailseite für den ausgewählten Benutzer zu navigieren. Die Benutzer-ID wird aus dem data-user-id-Attribut des Buttons extrahiert.
 */

function startseiteLaden() {
    let searchInput = document.getElementById('search');
    let searchButton = document.getElementById('search-button');
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
    document.getElementById("search-button").addEventListener("click", function () {
        let city = formatieren(document.getElementById("search").value);
        let searchContainer = document.querySelector('.search-container');
        searchContainer.style.display = "none";
        //Prüfen, ob eine Stadt eingeben wurde
        if (city) {
            let apiUrl = `https://dummyjson.com/users/filter?key=address.city&value=${city}`;

            //API-Aufruf
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    let users = data.users;
                    //Prüfen, ob in der Stadt User vorhanden sind
                    if (users.length > 0) {
                        let resultContainer = document.getElementById("result");
                        resultContainer.innerHTML = "";
                        //Erstellen der Usercard für jeden einzelnen User
                        users.forEach(user => {
                            let userCard = document.createElement("div");
                            userCard.classList.add("user-card");

                            let userName = document.createElement("h2");
                            userName.textContent = `${user.firstName} ${user.lastName}`;
                            userCard.appendChild(userName);

                            //Hinzufügen des Details Button, über den auf die Detail Website zugegriffen werden kann
                            let detailsButton = document.createElement("button");
                            detailsButton.classList.add("details-button");
                            detailsButton.textContent = "Details";

                            // FHinzufügen der User ID, damit diese später direkt in die URl übergeben werden kann und somit die Detailseite geöffnet werden kann
                            detailsButton.setAttribute("data-user-id", user.id);

                            userCard.appendChild(detailsButton);
                            resultContainer.appendChild(userCard);
                        });

                        // Ausgabe eines Fehler, wenn es in der Stadt keine User gibt
                    } else {
                        let resultContainer = document.getElementById("result");
                        resultContainer.innerHTML = "<p>Keine Benutzer gefunden.</p>";
                    }
                })
                //Fehlerbehandlung
                .catch(error => {
                    console.error("Fehler beim Abrufen der Daten:", error);
                });
        } else {
            window.location.href = "startseite.html";
        }
    });

    // Erstellen des Listener für den Details Button, der auf die neue Detal Seite weiterleiten soll
    document.getElementById('result').addEventListener('click', function (event) {
        if (event.target && event.target.className === 'details-button') {
            let userId = event.target.getAttribute('data-user-id');
            showDetails(userId);
        }
    });
}

/*
    Diese Funtkion erstellt den Link auf die Detailseite. Dabei wird eine Nutzer ID übergeben, die später in die URL der aufgerufenen Seite
    geschrieben wird. Dies hat den Sinn, dass die User ID auf der nächsten Seite ohne eine andere aufwendige implementierung genutzt werde kann
    und somit direkt aus der URL extrahiert werden kann. Das # vor der URL signalisiert, dass es sich nicht um eine gänzlich neue HTML Datei
    handelt, sondern eine Unterseite von Startseite.html ist.
*/

function showDetails(userId) {
    window.location.href = `#/detail/${userId}`;
}

/*
    Diese Funktion erstellt die Detailseite, die aufgerufen wird, wenn ein Benutzer auf einen bestimmten Benutzer klickt,
    um weitere Informationen anzuzeigen. Die Funktion ist dafür verantwortlich, die benötigten Elemente und Informationen zu laden und anzuzeigen.
    Zuerst werden Verweise auf die HTML-Elemente für den Seitentitel und den Container für die Benutzerdetails geholt. 
    Dann wird die aktuelle URL der Seite abgerufen und mit einem regulären Ausdruck analysiert, um die Benutzer-ID aus der URL zu extrahieren.
    Nachdem die Benutzer-ID ermittelt wurde, wird das Suchcontainer-Element (normalerweise eine Suchleiste) ausgeblendet, um die leere Startseite zu simulieren. 
    Ein Event-Listener wird dem Titel hinzugefügt, um die Suchleiste zu leeren und zur Startseite zurückzukehren, wenn auf den Text "Post@Data" geklickt wird.
    Der Code ruft dann API-Aufrufe auf, um Benutzerdaten und die Posts des ausgewählten Benutzers abzurufen. Die Benutzerdaten enthalten den Benutzernamen.
    Je nachdem, ob der Benutzer bereits Posts erstellt hat oder nicht, wird entsprechender HTML-Inhalt für die Anzeige erstellt.
    Wenn Posts vorhanden sind, werden diese in Postkarten angezeigt, die im Container für Benutzerdetails platziert werden. 
    Zusätzlich wird für jeden Post ein "Kommentare anzeigen"-Button erstellt, der auf die Kommentarsektion des jeweiligen Posts verweist. 
    Dies wird durch Event-Listener realisiert.
    Die Fehlerbehandlung ist ebenfalls vorhanden, um auf mögliche Fehler bei den API-Aufrufen zu reagieren. 
*/

function detailseiteLaden() {

    let title = document.getElementById('title');
    let userDetailsContainer = document.getElementById('user-details');
    let url = window.location.href;
    let regex = /detail\/(.*)/;
    let match = regex.exec(url);
    let number = match[1];
    let searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = "none";

    // Wenn man auf den Text Post@Data klickt, wird die Suchleiste geleert, um wieder die leere Startseite zu simulieren
    title.addEventListener('click', function () {
        title.href = `#/detail`
    });


    fetch(`https://dummyjson.com/users/${number}`)
        .then(res => res.json())
        .then(userData => {
            let username = userData.username;
            // API-Aufruf, um die Posts des Users zu erhalten
            fetch(`https://dummyjson.com/posts/user/${number}`)
                .then(res => res.json())
                .then(data => {
                    let userPosts = data.posts;
                    // Prüfen, ob ein User bereits Posts erstellt hat
                    if (userPosts.length > 0) {
                        // Posts anzeigen
                        let userDetailsHTML = `
                        <h2>Alle Posts von dem Nutzer ${username}</h2>
                        <div class="user-posts">
                            ${userPosts.map(post => createPostCard(post)).join('')}
                        </div>`;

                        userDetailsContainer.innerHTML = userDetailsHTML;
                    } else {
                        let userDetailsHTML = `${username} hat bisher keine Posts erstellt`;
                        userDetailsContainer.innerHTML = userDetailsHTML;
                    }

                    // Hinzufügen von Kommentar-Buttons zu jedem Post
                    userPosts.forEach(post => {
                        let commentButton = document.createElement('button');
                        commentButton.classList.add("details-button");
                        commentButton.innerText = 'Kommentare anzeigen';
                        commentButton.addEventListener('click', () => kommentareZeigen(post.id));
                        let postCard = document.querySelector(`#post-${post.id}`);
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

/*
    Diese Methode hat den selben Sinn und Aufbau, wie auch schon die Methode "showdetails"
*/

function kommentareZeigen(postId) {
    window.location.href = `#/kommentare/${postId}`;
}

/*
    Diese Methode blendet zuerst die Suchleiste für den Kommentarbereich aus, da diese hier störend ist.
    Weiterhin gettet sie die aktuelle URl und extrahiert die PostID aus der aktuellen URL. Danach ruft sie die Funktion 
    showPostComments auf, die alle Kommentare zu den einzelnen Posts anzeigt.
*/

function kommentarseiteLaden() {
    let searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = "none";
    let url = window.location.href;
    let regex = /kommentare\/(.*)/;
    let match = regex.exec(url);
    let postId = match[1];
    showPostComments(postId);

}

/*
    Diese Methode erstellt die sogenannte postCard. Dieses Konzept der Cards wird auch schon für die UserCards und die CommentCards verwendet.
    Dabei hat jeder Post einen eigenen "Card", auf der alle details zu diesem angezeigt werden.
*/

function createPostCard(post) {
    return `
        <div class="post-card" id="post-${post.id}">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
        </div>
    `;
}

/*
    Die Funktion showPostComments zeigt, wie Kommentare für einen bestimmten Post auf einer Webanwendungsseite abgerufen und angezeigt werden können.
    Die zentrale Funktion dieses Codes ist der API-Aufruf, um Kommentare für einen spezifischen Post abzurufen. 
    Dies wird durch die Verwendung der fetch-Methode realisiert, die eine HTTP-Anfrage an die angegebene URL sendet. 
    Die URL ist so konstruiert, dass sie auf die Kommentare für den entsprechenden Post abzielt.
    Die erhaltenen Daten werden in JSON umgewandelt und verarbeitet. Wenn Kommentare vorhanden sind (überprüft durch die Länge des comments-Arrays), 
    werden diese in HTML-Daten umgewandelt. Jeder Kommentar wird in einer Kommentarkarte dargestellt, die in einer HTML-Struktur zusammengesetzt wird.
    Die erstellten HTML-Kommentare werden in das Element mit der ID 'user-details2' eingefügt, wodurch die Kommentare auf der Seite angezeigt werden. 
    Wenn keine Kommentare vorhanden sind, wird eine entsprechende Meldung angezeigt.
    Der Code enthält auch eine Fehlerbehandlung, die auf mögliche Fehler bei der Kommunikation mit der API hinweist und Details zu Fehlern in der Konsole ausgibt.
*/

function showPostComments(postId) {
    console.log("test1");
    let userDetailsContainer = document.getElementById('user-details2');
    // API-Aufruf, um Kommentare für einen bestimmten Post abzurufen
    fetch(`https://dummyjson.com/comments/post/${postId}`)
        .then(res => res.json())
        .then(data => {
            let comments = data.comments;
            if (comments.length > 0) {
                console.log(comments);
                // Hier erstellen wir ein HTML-Element für Kommentare und füllen es mit den Kommentaren
                let commentsHTML = `
                <h2>Kommentare für Post #${postId}</h2>
                <div class="comments">
                    ${comments.map(comment => createCommentCard(comment)).join('')}
                </div>
            `;
                // Hier fügen wir das HTML-Element für Kommentare in die Seite ein
                userDetailsContainer.innerHTML = commentsHTML;
            }
            else {
                userDetailsContainer.innerHTML = `<h2>Post #${postId} hat leider noch keine Kommentare`;
            }
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Kommentare:", error);
        });
}

/*
    Diese Funktion arbeit genauso wie die Funktion createPostCard und erstellt die einzelnen Cards für die Posts
*/

function createCommentCard(comment) {
    return `
        <div class="comment-card">
            <p><strong>Kommentar des Users: ${comment.user.username}</strong></p>
            <p>${comment.body}</p>
        </div>
    `;
}

/*
    Dieser Eventlistener ist vom Grundprinzip aus den Vorlesungsunterlagen entnommen. Er wurde aber so angepasst, 
    dass die individuellen Seiten, wie z.B. detail oder kommentare enthalten sind. Außerdem wurd die Funktion des Seiten ladens 
    hinzugefügt, die, wie in den Beschreibungen zu ihnen oben beschrieben, den Aufbau der einzelnen Seiten spezifizieren.
    Der Eventlistner ist dabei das erste, was in der JS ausgeführt wird und ist dafür zuständig die Veränderungen an der URL zu erkennen
    und entprechend auf diese zu reagieren und die richtigen HTML Elemente ein- und auszublenden.
*/

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

