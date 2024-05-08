

function chargerPersonnes() {
    fetch('/personnes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('personnesTableBody');
            tableBody.innerHTML = '';

            data.forEach(personne => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${personne.national_id}</td>
                        <td>${personne.last_name}</td>
                        <td>${personne.first_name}</td>
                        <td><input type="text" id="prix_${personne.national_id}" value=""></td>
                    `;
                tableBody.appendChild(row);

                // Call fetchAndSetPrice to populate the price for each individual
                fetchAndSetPrice(personne.national_id);
            });
        })
    fetch('/totalPrice')
        .then(response => response.json())
        .then(data => {
            const totalPrice = data.totalPrice;
            const totalPrixElement = document.getElementById('totalPrix');
            totalPrixElement.textContent = totalPrice.toFixed(2); // Update the total price element in the HTML
        })
        .catch(error => {
            console.error('Error fetching total price:', error);
            // Handle error fetching the total price here
        });

}










// Appel de la fonction pour charger les personnes au chargement de la page
window.onload = chargerPersonnes;







function enregistrerPrix() {
    // Récupérer les valeurs des prix depuis les champs input
    const prixData = [];
    const personnesInputs = document.querySelectorAll('input[type="text"]');
    personnesInputs.forEach(input => {
        const nationalId = input.id.split('_')[1];
        const prix = input.value;
        prixData.push({ nationalId, prix });
    });

    // Envoi des données au backend pour enregistrement
    fetch('/enregistrerPrix', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prixData)
    })
        .then(response => {
            if (response.ok) {
                alert('Prix enregistrés avec succès !');
                // Recharger les données des personnes après l'enregistrement des prix
                chargerPersonnes();
            } else {
                throw new Error('Erreur lors de l\'enregistrement des prix.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement des prix:', error);
        });
}


function fetchAndSetPrice(nationalId) {
    fetch(`/getPrice/${nationalId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const price = data.price;
            const prixInput = document.getElementById(`prix_${nationalId}`);
            prixInput.value = price ? price.toFixed(2) : ''; // Set to empty string if price is null or undefined
        })
        .catch(error => {
            console.error('Error fetching and setting price:', error);
            // Handle error fetching the price here
        });
}

