fetch('/getMedicalPatients')
    .then(response => response.json())
    .then(data => {
        const medicalPatientsSection = document.getElementById('medicalPatients');
        displayPatients(data, medicalPatientsSection);
    })
    .catch(error => {
        console.error('Error fetching medical patients:', error);
    });

fetch('/getSurgicalPatients')
    .then(response => response.json())
    .then(data => {
        const surgicalPatientsSection = document.getElementById('surgicalPatients');
        displayPatients(data, surgicalPatientsSection);
    })
    .catch(error => {
        console.error('Error fetching surgical patients:', error);
    });

function displayPatients(patients, section) {
    patients.forEach(patient => {
        const patientItem = document.createElement('div');
        patientItem.classList.add('patient-item');

        const img = document.createElement('img');
        img.src = patient.imageUrl;
        img.alt = patient.national_id;

        const details = document.createElement('div');
        details.classList.add('patient-details');

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = `Name: ${patient.name || 'Unknown'}`;

        const idParagraph = document.createElement('p');
        idParagraph.textContent = `ID: ${patient.national_id || 'Unknown'}`;

        img.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior
            console.log('Clicked on image');
            console.log('Clicked on patient with type:', patient.type);
            // Redirect to different pages based on patient type
            if (patient.type === 'medical') {
                console.log('Redirecting to medical patient details page...');
                window.location.href = `/patient_details.html?nationalId=${patient.national_id}`;
            } else if (patient.type === 'surgical') {
                console.log('Redirecting to surgical patient details page...');
                window.location.href = `/operation.html?nationalId=${patient.national_id}`;
            }
        });




        details.appendChild(nameParagraph);
        details.appendChild(idParagraph);

        patientItem.appendChild(img);
        patientItem.appendChild(details);

        section.appendChild(patientItem);
    });
}


function goToIndex() {
    window.location.href = 'index.html';
}

function fetchDataFromServer(endpoint) {
    return fetch(endpoint)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function filterPatients(patients, query) {
    return patients.filter(patient => {
        return (
            patient.name.toLowerCase().includes(query.toLowerCase()) ||
            patient.national_id.toLowerCase().includes(query.toLowerCase())
        );
    });
}


function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase(); // Get the lowercase trimmed query

    const medicalPatientsSection = document.getElementById('medicalPatients');
    const surgicalPatientsSection = document.getElementById('surgicalPatients');

    medicalPatientsSection.innerHTML = '';
    surgicalPatientsSection.innerHTML = '';

    fetchDataFromServer('/getMedicalPatients')
        .then(medicalPatients => {
            const filteredMedicalPatients = filterPatients(medicalPatients, query);
            displayPatients(filteredMedicalPatients, medicalPatientsSection);
        });

    fetchDataFromServer('/getSurgicalPatients')
        .then(surgicalPatients => {
            const filteredSurgicalPatients = filterPatients(surgicalPatients, query);
            displayPatients(filteredSurgicalPatients, surgicalPatientsSection);
        });
}




const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', handleSearch);
