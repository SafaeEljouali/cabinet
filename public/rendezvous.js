document.getElementById('fileAttenteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        nom: document.getElementById('nomFile').value,
        date: document.getElementById('dateFile').value,
        heure: document.getElementById('heureFile').value
    };

    fetch('/fileattente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Ajouté à la File d\'Attente:', data);
            // Rafraîchir la table de la File d'Attente
            refreshFileAttenteTable();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout à la File d\'Attente:', error);
            // Gérer les erreurs
        });
});

document.getElementById('rdvFutursForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        nom: document.getElementById('nomRdvFuturs').value,
        date: document.getElementById('dateRdvFuturs').value,
        heure: document.getElementById('heureRdvFuturs').value
    };

    fetch('/rendezvousfuturs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Rendez-vous Futur ajouté:', data);
            // Rafraîchir la table des Rendez-vous Futurs
            refreshRdvFutursTable();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du Rendez-vous Futur:', error);
            // Gérer les erreurs
        });
});
function refreshFileAttenteTable() {
    fetch('/fileAttenteData')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableFileAttente');
            tableBody.innerHTML = '';
            data.forEach(appointment => {
                const row = `<tr>
                            <td>${appointment.nom}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.heure}</td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });


        })
        .catch(error => {
            console.error('Error refreshing File d\'Attente table:', error);
            // Handle errors
        });
}

function refreshRdvFutursTable() {
    fetch('/rdvFutursData')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableRendezVousFuturs');
            tableBody.innerHTML = '';
            data.forEach(appointment => {
                const row = `<tr>
                            <td>${appointment.nom}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.heure}</td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });


        })
        .catch(error => {
            console.error('Error refreshing Rendez-vous Futurs table:', error);
            // Handle errors
        });
}


function loadRendezVous() {
    fetch('/rendezvousaujourdhui')
        .then(response => response.json())
        .then(data => {
            // Mettre à jour la table avec les rendez-vous récupérés
            const tableBody = document.getElementById('tableRendezVousAujourdhui');


            tableBody.innerHTML = ''; // Efface le contenu actuel de la table

            data.appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${appointment.nom}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.heure}</td>
                        `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des rendez-vous:', error));
}

// Appel de la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', loadRendezVous);

// Appel initial des tables au chargement de la page
refreshFileAttenteTable();
refreshRdvFutursTable();
