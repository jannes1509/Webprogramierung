document.getElementById("search-button").addEventListener("click", function () {
    const city = document.getElementById("search").value;
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

// Abruf der Detailansicht für die spezifische User ID 
function showDetails(userId) {
    // Erstellen der individuellen URL für den User auf der Detailseite
    window.location.href = `detail.html?userId=${userId}`;
}

//Erstellen weiterer Listener für die Suche, die Ergebnisse und den Titel

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resultBox = document.getElementById('result');
    const title = document.getElementById('title');

    // Hinzufügen einer Verarbeitung für die Enter Taste, damit beim drücken dieser automatischgesucht wird
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Wenn man auf den Text Post@Data klickt, wird die Suchleiste geleert, um wieder die leere Startseite zu simulieren
    title.addEventListener('click', function () {
        resultBox.textContent = 'Geben Sie eine Stadt ein, um Benutzer anzuzeigen. Wenn Sie eine Stadt eingegeben haben, in der User registriert sind, dann erhalten sie die Möglichkeit alle Posts dieser User zu sehen. Besonders aktiv sind unsere Usern in größeren Städten, wie zum Beispiel Manchester oder Washington';
        searchInput.value = '';
    });
});

