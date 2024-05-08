function addUser() {
    const userData = getUserDataFromForm();
    if (!userData) return;

    sendUserDataToServer(userData)
        .then(() => {
            const nationalId = userData.national_id;
            uploadImage(nationalId); // Upload image after user is added
            fetchAndDisplayUsersWithImages(); // Display updated users with images
        })
        .catch(error => console.error('Error adding user:', error));
}


function uploadImage(nationalId) {
    const fileInput = document.getElementById('file');
    const image = fileInput.files[0];

    if (!image) {
        console.error('No image selected');
        return;
    }

    const formData = new FormData();
    formData.append('national_id', nationalId); // Ensure 'national_id' matches the server
    formData.append('image', image);

    return fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error uploading image');
            }
            console.log('Image uploaded successfully');
        })
        .catch(error => console.error('Error uploading image:', error));
}

function fetchAndDisplayUsersWithImages() {
    console.log('Fetching users with images...');
    fetch('/usersWithImages')
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error(`Failed to fetch users with images. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            if (!data || !data.users || data.users.length === 0) {
                throw new Error('No user data with images available.');
            }
            // Call displayUserWithImage for each user fetched
            data.users.forEach(user => {
                console.log('Displaying user:', user);
                displayUserWithImage(user);
            });
        })
        .catch(error => console.error('Error fetching or displaying users with images:', error.message));
}




function displayUserWithImage(user) {
    console.log('Displaying user:', user);

    const userTableBody = document.getElementById('userTableBody');

    const newRow = userTableBody.insertRow();
    const imageCell = newRow.insertCell();
    const userDataKeys = ['national_id', 'last_name', 'first_name', 'date_of_adding', 'age', 'phone_number', 'gender', 'condition_type'];

    // Display image if available
    if (user.image_url) {
        const img = document.createElement('img');
        const imageUrl = `data:image/jpeg;base64,${arrayBufferToBase64(user.image_url.data)}`; // Assuming image_url.data is the image buffer data

        console.log('Attempting to load image:', imageUrl);

        img.onload = function() {
            console.log('Image loaded successfully:', imageUrl);
        };
        img.onerror = function() {
            console.error('Error loading image:', imageUrl);
        };

        img.src = imageUrl;
        img.width = 100; // Adjust the width as needed
        img.height = 100; // Adjust the height as needed
        imageCell.appendChild(img);
    } else {
        imageCell.textContent = 'No Image';
    }

    // Display user data in subsequent cells
    userDataKeys.forEach(key => {
        const newCell = newRow.insertCell();
        newCell.textContent = user[key] || ''; // If data is missing, display an empty string
    });

    // Actions cell (delete button)
    const actionsCell = newRow.insertCell();
    actionsCell.appendChild(createDeleteButton(user.national_id));
    actionsCell.appendChild(createModifyButton(user.national_id));




    // Check if all cells are filled and add empty cells if needed
    const cellsCount = newRow.cells.length;
    const requiredCells = userDataKeys.length + 2; // userDataKeys + Image Cell + Actions Cell
    if (cellsCount < requiredCells) {
        const missingCells = requiredCells - cellsCount;
        for (let i = 0; i < missingCells; i++) {
            newRow.insertCell();
        }
    }
}

function arrayBufferToBase64(buffer) {
    const binary = new Uint8Array(buffer);
    let base64 = '';
    binary.forEach(byte => base64 += String.fromCharCode(byte));
    return window.btoa(base64);
}






function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('userTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let visible = false;
        const cells = rows[i].getElementsByTagName('td');

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const textValue = cell.textContent || cell.innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    visible = true;
                    break;
                }
            }
        }

        rows[i].style.display = visible ? '' : 'none';
    }
}





function getUserDataFromForm() {
    const nationalId = document.getElementById("natio").value;
    const lastName = document.getElementById("nom").value;
    const firstName = document.getElementById("prenom").value;
    const dateOfAdding = new Date().toISOString();
    const age = document.getElementById("age").value;
    const phoneNumber = document.getElementById("phone").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const condition = document.getElementById("condition").value;

    const fileInput = document.getElementById('file'); // Update to use the correct input ID
    const image = fileInput.files[0];

    // Validation checks for image presence and other fields
    if (!image) {
        alert('Please select an image.');
        return null; // Return null if image is not selected
    }

    const formData = new FormData();
    formData.append('name', nationalId); // Using national ID as 'name' for illustration
    formData.append('image', image);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Optionally, update table or perform other actions upon successful upload
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if necessary
        });

    return {
        national_id: nationalId,
        last_name: lastName,
        first_name: firstName,
        date_of_adding: dateOfAdding,
        age: age,
        phone_number: phoneNumber,
        gender: gender,
        condition_type: condition,
    };
}

function sendUserDataToServer(userData) {
    return fetch('/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding user');
            }
            console.log('User added successfully');
        });
}

/*

function createDeleteButton(nationalId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteUser(nationalId));
    return deleteButton;
}



function deleteUser(nationalId) {
    fetch(`/deleteUser/${nationalId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting user');
            }
            console.log('User deleted successfully');
            fetchAndDisplayUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
}

 */

function createDeleteButton(nationalId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => confirmDeletion(nationalId));
    return deleteButton;
}

function confirmDeletion(nationalId) {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
        deleteUser(nationalId);
    } else {
        console.log('Deletion cancelled');
        // You can add any further action if deletion is cancelled
    }
}

function deleteUser(nationalId) {
    fetch(`/deleteUser/${nationalId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting user');
            }
            console.log('User deleted successfully');
            fetchAndDisplayUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
}




document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayUsersWithImages(); // Call the function to fetch users with images
});






function goBack() {

}

/*

function createModifyButton(nationalId) {
    const ModifyButton = document.createElement('button');
    ModifyButton.textContent = 'Modify';
    ModifyButton.addEventListener('click', () => {
        // Fetch user data based on the nationalId
        fetch(`/getUserDetails/${nationalId}`)
            .then((response) => response.json())
            .then((data) => {
                // Populate form fields with retrieved data
                document.getElementById("natio").value = data.national_id;
                document.getElementById("nom").value = data.last_name;
                document.getElementById("prenom").value = data.first_name;
                document.getElementById("dateOfAdding").value = data.date_of_adding; // Assuming the date is correctly formatted
                document.getElementById("age").value = data.age;
                document.getElementById("phone").value = data.phone_number;

                // Check the appropriate radio button for gender
                const gender = data.gender.toLowerCase();
                document.getElementById(gender).checked = true;

                document.getElementById("condition").value = data.condition_type;
                // Other fields...
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error if necessary
            });
    });
    return ModifyButton;
}

 */

function createModifyButton(nationalId) {
    const modifyButton = document.createElement('button');
    modifyButton.textContent = 'Modify';
    modifyButton.addEventListener('click', () => confirmModification(nationalId));
    return modifyButton;
}

function confirmModification(nationalId) {
    const confirmation = confirm('Are you sure you want to modify this user?');
    if (confirmation) {
        modifyUser(nationalId);
    } else {
        console.log('Modification cancelled');
        // You can add any further action if modification is cancelled
    }
}

function modifyUser(nationalId) {
    fetch(`/getUserDetails/${nationalId}`)
        .then((response) => response.json())
        .then((data) => {
            // Populate form fields with retrieved data
            document.getElementById("natio").value = data.national_id;
            document.getElementById("nom").value = data.last_name;
            document.getElementById("prenom").value = data.first_name;
            document.getElementById("dateOfAdding").value = data.date_of_adding; // Assuming the date is correctly formatted
            document.getElementById("age").value = data.age;
            document.getElementById("phone").value = data.phone_number;

            // Check the appropriate radio button for gender
            const gender = data.gender.toLowerCase();
            document.getElementById(gender).checked = true;

            document.getElementById("condition").value = data.condition_type;
            // Other fields...
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error if necessary
        });
}




document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayUsers();
});



document.addEventListener('DOMContentLoaded', () => {
    fetch('/personnes') // L'URL dépend de votre configuration serveur
        .then(response => response.json())
        .then(data => {
            const personnesTableBody = document.getElementById('personnesTableBody');
            data.forEach(personne => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${personne.national_id}</td>
                    <td>${personne.nom}</td>
                    <td>${personne.prenom}</td>
                    <td><input type="number" id="prix_${personne.national_id}" name="prix_${personne.national_id}"></td>
                `;
                personnesTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
});

function enregistrerPrix() {
    const personnes = document.querySelectorAll('[id^="prix_"]');
    const prixData = [];

    personnes.forEach(personne => {
        const nationalId = personne.id.split('_')[1];
        const prix = personne.value;
        prixData.push({ nationalId, prix });
    });

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
            } else {
                throw new Error('Erreur lors de l\'enregistrement des prix');
            }
        })
        .catch(error => console.error('Erreur lors de l\'enregistrement des prix:', error));
}




function chargerPersonnes() {
    fetch('/personnes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('personnesTableBody');
            tableBody.innerHTML = ''; // Vide le contenu précédent de la table

            data.forEach(personne => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${personne.national_id}</td>
                    <td>${personne.last_name}</td>
                    <td>${personne.first_name}</td>
                    <td><input type="text" id="prix_${personne.national_id}" value=""></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des personnes:', error);
        });
}

window.onload = chargerPersonnes;


document.querySelector('.modifyBtn').addEventListener('click', () => {
    // Gather modified data from the form fields
    const modifiedUserData = {
        national_id: document.getElementById("natio").value,
        last_name: document.getElementById("nom").value,
        first_name: document.getElementById("prenom").value,
        date_of_adding: document.getElementById("dateOfAdding").value,
        age: document.getElementById("age").value,
        phone_number: document.getElementById("phone").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        condition_type: document.getElementById("condition").value
        // Add other fields as needed
    };

    // Send the modified data to the server
    fetch('/modifyUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedUserData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User modified:', data);
        })
        .catch(error => {
            console.error('Error modifying user:', error);
        });
});

