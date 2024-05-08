console.log('Script is running...');

function fetchBeds() {
    fetch('/beds')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const bedsContainer = document.getElementById('bedsContainer');
            data.slice(0, 10).forEach((bed, index) => {
                const bedDiv = document.createElement('div');
                bedDiv.classList.add('bed');
                const bedImage = document.createElement('img');
                bedImage.src = 'https://medtegrity.us/wp-content/uploads/2018/05/hospital-bed-linen-service-1000x430.jpg';
                bedImage.alt = `Bed ${bed.bed_number}`;
                bedDiv.appendChild(bedImage);

                const bedNumber = document.createElement('div');
                bedNumber.classList.add('number');
                bedNumber.textContent = index + 1; // Start numbering from 1
                bedDiv.appendChild(bedNumber);

                if (bed.status === 'available') {
                    bedDiv.style.backgroundColor = 'green';
                } else if (bed.status === 'unavailable') {
                    bedDiv.style.backgroundColor = 'red';
                }

                bedDiv.addEventListener('click', () => toggleStatus('beds', bed.id, bed.status));

                bedsContainer.appendChild(bedDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching bed data:', error);
        });
}

function fetchOperatingBlocks() {
    fetch('/bloc_operatoire')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const blocContainer = document.getElementById('blocContainer');
            data.slice(0, 5).forEach((bloc, index) => {
                const statusDiv = document.createElement('div');
                statusDiv.classList.add('bloc');
                const statusImage = document.createElement('img');
                statusImage.src = 'https://www.larousse.fr/encyclopedie/data/images/1007090-Bloc_op%C3%A9ratoire.jpg';
                statusImage.alt = `Bloc ${bloc.id}`;
                statusDiv.appendChild(statusImage);

                const statusNumber = document.createElement('div');
                statusNumber.classList.add('number');
                statusNumber.textContent = index + 1; // Start numbering from 1
                statusDiv.appendChild(statusNumber);

                if (bloc.status === 'available') {
                    statusDiv.style.backgroundColor = 'green';
                } else if (bloc.status === 'unavailable') {
                    statusDiv.style.backgroundColor = 'red';
                }

                statusDiv.addEventListener('click', () => toggleStatus('bloc_operatoire', bloc.id, bloc.status));

                blocContainer.appendChild(statusDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Bloc Opératoire status:', error);
        });
}

function toggleStatus(type, id, currentStatus) {
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    fetch(`/${type}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Updated ${type} status:`, data);
            const element = document.getElementById(`${type}-${id}`);
            if (newStatus === 'available') {
                element.style.backgroundColor = 'green';
            } else if (newStatus === 'unavailable') {
                element.style.backgroundColor = 'red';
            }
        })
        .catch(error => {
            console.error(`Error updating ${type} status:`, error);
        });
}

window.onload = () => {
    fetchBeds();
    fetchOperatingBlocks();
};