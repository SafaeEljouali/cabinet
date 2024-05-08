
function ajouterConsultation(){
    ajoutercons();
    refreshcons();

}

function ajoutercons() {
    var Num_Consultation = document.getElementById('Num_Consultation').value;
    var Date = document.getElementById('Date').value;
    var Symptome = document.getElementById('Symptome').value;
    var Hypertension_Arterielle = document.getElementById('Hypertension_Arterielle').value;
    var Diabete = document.getElementById('Diabete').value;
    var Remarque = document.getElementById('Remarque').value;

    const urlParams = new URLSearchParams(window.location.search);
    const nationalId = urlParams.get('nationalId');

    var traitementData = {
        Num_Consultation: Num_Consultation,
        Date: Date,
        Symptome: Symptome,
        Hypertension_Arterielle: Hypertension_Arterielle,
        Diabete: Diabete,
        Remarque: Remarque,
        National_id: nationalId
    };

    fetch('/savecons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(traitementData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Treatment data sent:', data);
            // Handle success, show a success message, or perform other actions
        });
}




function refreshcons() {
    const urlParams = new URLSearchParams(window.location.search);
    const nationalId = urlParams.get('nationalId');

    fetch(`/appelcons?nationalId=${nationalId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('consultt');
            tableBody.innerHTML = '';
            data.forEach(trt => {
                const row = `<tr>
                                <td>${trt.Num_Consultation}</td>
                                <td>${trt.Date}</td>
                                <td>${trt.Symptome}</td>
                                <td>${trt.Hypertension_Arterielle}</td>
                                <td>${trt.Diabete}</td>
                                <td>${trt.Remarque}</td>
                                <td><button onclick="deleteConsultation(${trt.id})">Delete</button></td>
                                </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);

            });
        })
        .catch(error => {
            console.error('Error fetching consultations:', error);
            // Handle errors
        });
}

document.addEventListener('DOMContentLoaded', refreshcons);


function deleteConsultation(id) {
    fetch(`/deleteConsultation/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Consultation deleted:', data);
            // Refresh the table or handle the UI to reflect the deleted row
            // Call refreshcons() or remove the row from the UI
        })
        .catch(error => {
            console.error('Error deleting consultation:', error);
            // Handle errors
        });
}


function ajouterGraphe() {
    addGraph();
    refreshGraph();
}

function addGraph() {
    var Nbr_Graphe = document.getElementById('Nbr_Graphe').value;
    var Date_Graph = document.getElementById('Date_Graph').value;
    var nationalId = new URLSearchParams(window.location.search).get('nationalId');

    var formData = new FormData();
    formData.append('Nbr_Graphe', Nbr_Graphe);
    formData.append('Date_Graph', Date_Graph);
    formData.append('National_id', nationalId);
    formData.append('PhotoGraphe', document.getElementById('PhotoGraphe').files[0]);

    fetch('/savegraphe', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Treatment data sent:', data);
            refreshGraph(); // Refresh data after upload
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
}

function refreshGraph() {
    const nationalId = new URLSearchParams(window.location.search).get('nationalId');

    fetch(`/appelgraphe?nationalId=${nationalId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('Graphh');
            tableBody.innerHTML = '';
            data.forEach(grph => {
                const row = `<tr>
                                <td>${grph.Nbr_Graphe}</td>
                                <td>${grph.Date_Graph}</td>
                                <td><img src="${grph.Photo_graphe}" width="100" height="100"></td>
                                <td><button onclick="deletegraphe(${grph.Nbr_Graphe})">Delete</button></td>
                            </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Error refreshing graph data:', error);
        });
}

document.addEventListener('DOMContentLoaded', refreshGraph);


function deletegraphe(Nbr_Graphe) {
    fetch(`/deletegraphe/${Nbr_Graphe}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Graphe deleted:', data);
            // Refresh the table or handle the UI to reflect the deleted row
            // Call refreshgraph() or remove the row from the UI
        })
        .catch(error => {
            console.error('Error deleting graphe:', error);
            // Handle errors
        });
}








function ajouterAnalyse() {
    addAnalysis();
    refreshAnalyses();
}

function addAnalysis() {
    var Nbr = document.getElementById('Nbr').value;
    var Dateanalyse = document.getElementById('Dateanalyse').value;
    var nationalId = new URLSearchParams(window.location.search).get('nationalId');
    var formData = new FormData();

    formData.append('Nbr', Nbr);
    formData.append('Dateanalyse', Dateanalyse);
    formData.append('National_id', nationalId);
    formData.append('Photo_analyse', document.getElementById('Photo_analyse').files[0]);

    fetch('/saveanalyse', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Treatment data sent:', data);
            refreshAnalyses();
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
}
function refreshAnalyses() {
    const nationalId = new URLSearchParams(window.location.search).get('nationalId');

    fetch(`/appelanalyse?nationalId=${nationalId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('analyss');
            tableBody.innerHTML = '';
            data.forEach(analy => {
                const row = `<tr>
                                <td>${analy.Nbr}</td>
                                <td>${analy.Dateanalyse}</td>
                                <td>${analy.Photo_analyse ? `<img src="data:image/jpeg;base64,${analy.Photo_analyse}" width="100" height="100" />` : 'No Image'}</td>
                                <td><button onclick="deleteanalyse(${analy.Nbr})">Delete</button></td>
                            </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Error refreshing analyse data:', error);
        });
}

document.addEventListener('DOMContentLoaded', refreshAnalyses);



function deleteanalyse(Nbr) {
    fetch(`/deleteanalyse/${Nbr}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Analyse deleted:', data);
            // Refresh the table or handle the UI to reflect the deleted row
            // Call refreshanalyses() or remove the row from the UI
        })
        .catch(error => {
            console.error('Error deleting analyse:', error);
            // Handle errors
        });
}


document.addEventListener('DOMContentLoaded', refreshAnalyses);





