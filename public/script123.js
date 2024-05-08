
function ajouterOperation(){
    ajouteroperation();
    refreshoperation();

}


function ajouteroperation() {
    var Num_Operation = document.getElementById('Num_Operation').value;
    var Type_Operation = document.getElementById('Type_Operation').value;
    var Dateo = document.getElementById('Dateo').value;
    var Heure = document.getElementById('Heure').value;
    var Salle = document.getElementById('Salle').value;
    var Anesthesie = document.getElementById('Anesthesie').value;
    var Instruments = document.getElementById('Instruments').value;
    var Nbr_infirmiers = document.getElementById('Nbr_infirmiers').value;

    const urlParams = new URLSearchParams(window.location.search);
    const nationalId = urlParams.get('nationalId');

    console.log('nationalId:', nationalId); // Log the value of nationalId

    var operationData = {
        Num_Operation: Num_Operation,
        Type_Operation: Type_Operation,
        Dateo: Dateo,
        Heure: Heure,
        Salle: Salle,
        Anesthesie: Anesthesie,
        Instruments: Instruments,
        Nbr_infirmiers: Nbr_infirmiers,
        National_id: nationalId // Include the nationalId in the operationData object
    };
    fetch('/saveoperation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(operationData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Operation data sent:', data);
            refreshoperation(); // Refresh data after adding operation
        })
        .catch(error => {
            console.error('Error sending operation data:', error);
        });

    console.log('operationData:', operationData); // Log the operationData object

    // Rest of your code...
}


function refreshoperation() {
    const urlParams = new URLSearchParams(window.location.search);
    const nationalId = urlParams.get('nationalId');

    fetch(`/appeloperation?nationalId=${nationalId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('operationTableBody');
            tableBody.innerHTML = '';
            data.forEach(op => {
                const row = `<tr>
                            <td>${op.Num_Operation}</td>
                            <td>${op.Type_Operation}</td>
                            <td>${op.Dateo}</td>
                            <td>${op.Heure}</td>
                            <td>${op.Salle}</td>
                            <td>${op.Anesthesie}</td>
                            <td>${op.Instruments}</td>
                            <td>${op.Nbr_infirmiers}</td>
                            <td><button onclick="deleteOperation(${op.id})">Delete</button></td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Error fetching operation data:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    refreshoperation(); // Call this initially to load data on page load
});

function deleteOperation(id) {
    fetch(`/deleteOperation/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Operation deleted:', data);
            refreshoperation(); // Refresh the table after deleting the operation
        })
        .catch(error => {
            console.error('Error deleting operation:', error);
        });
}
