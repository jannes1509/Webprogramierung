document.getElementById("search-button").addEventListener("click", function () {
    const city = document.getElementById("search").value;

    if (city) {
        const apiUrl = `https://dummyjson.com/users/filter?key=address.city&value=${city}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const users = data.users;

                if (users.length > 0) {
                    const resultContainer = document.getElementById("result");
                    resultContainer.innerHTML = "";

                    users.forEach(user => {
                        const userCard = document.createElement("div");
                        userCard.classList.add("user-card");

                        const userName = document.createElement("h2");
                        userName.textContent = `${user.firstName} ${user.lastName}`;
                        userCard.appendChild(userName);

                        const detailsButton = document.createElement("button");
                        detailsButton.classList.add("details-button");
                        detailsButton.textContent = "Details";

                        // Füge die Benutzer-ID als benutzer-id-Attribut hinzu
                        detailsButton.setAttribute("data-user-id", user.id);

                        userCard.appendChild(detailsButton);
                        resultContainer.appendChild(userCard);
                    });
                } else {
                    const resultContainer = document.getElementById("result");
                    resultContainer.innerHTML = "<p>Keine Benutzer gefunden.</p>";
                }
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Daten:", error);
            });
    } else {
        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML = "<p>Geben Sie eine Stadt ein, um Benutzer anzuzeigen.</p>";
    }
});

// Event-Handler für das Klicken auf "Details" in den Suchergebnissen
document.getElementById('result').addEventListener('click', function (event) {
    if (event.target && event.target.className === 'details-button') {
        const userId = event.target.getAttribute('data-user-id');
        showDetails(userId);
    }
});

// Funktion zum Abrufen von Benutzerdetails und Navigieren zur Detailansicht
function showDetails(userId) {
    // Navigieren zur detail.html-Seite mit Benutzer-ID als Query-Parameter
    window.location.href = `detail.html?userId=${userId}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resultBox = document.getElementById('result');
    const title = document.getElementById('title');

    // Hinzufügen der Enter-Tasten-Ereignisverarbeitung
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Klicken auf "Telefonbuch" stellt den ursprünglichen Text wieder her
    title.addEventListener('click', function() {
        resultBox.textContent = 'Geben Sie eine Stadt ein, um Benutzer anzuzeigen.';
        searchInput.value = ''; 
    });
});

// Funktion zum Abrufen von Benutzerdetails und Navigieren zur Detailansicht
function showDetails(userId) {
    // Navigieren zur detail.html-Seite mit Benutzer-ID als Query-Parameter
    window.location.href = `detail.html?userId=${userId}`;
}
