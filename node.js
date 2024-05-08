const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Constructing the URL with the nationalId parameter



const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'myroot2468',
    database: 'jsdatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});


app.get('/getUsers', fetchUsers);




app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', serveHomePage);

function serveHomePage(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/compatbilite.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/testbefore.html'));
});

app.get('/scene', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});



app.get('/rendez_vous', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rendez_vous.html'));
});

app.get('/Main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'testbefore.html'));
});




function fetchUsers(req, res) {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Error fetching users from MySQL');
        } else {
            res.status(200).json({ users: results });
        }
    });
}

app.post('/addUser', addUser);
function addUser(req, res) {
    const { national_id, last_name, first_name, date_of_adding, age, phone_number, gender, condition_type } = req.body;
    const sql = 'INSERT INTO users (national_id, last_name, first_name, date_of_adding, age, phone_number, gender, condition_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [national_id, last_name, first_name, date_of_adding, age, phone_number, gender, condition_type], (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            res.status(500).send('Error adding user to MySQL');
        } else {
            console.log('User added to MySQL');
            res.status(200).send('User added successfully');
        }
    });
}


app.delete('/deleteUser/:nationalId', deleteUser);

function deleteUser(req, res) {
    const nationalId = req.params.nationalId;
    const sql = 'DELETE FROM users WHERE national_id = ?';
    connection.query(sql, [nationalId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user from MySQL');
        } else {
            console.log('User deleted from MySQL');
            res.status(200).send('User deleted successfully');
        }
    });
}




app.post('/upload', upload.single('image'), (req, res) => {
    console.log('Upload endpoint hit');
    const nationalId = req.body.national_id || req.body.name; // Check both keys
    console.log('Request body:', req.body);
    console.log('Received national ID:', nationalId);

    if (!nationalId) {
        console.error('No national ID received');
        res.status(400).send('No national ID received');
        return;
    }

    const image = req.file.buffer;

    const sqlCheck = 'SELECT * FROM images WHERE national_id = ?';
    connection.query(sqlCheck, [nationalId], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking image existence:', checkErr);
            res.status(500).send('Error checking image existence');
            return;
        }

        if (checkResults.length > 0) {
            console.log('Image already exists for national ID:', nationalId);
            res.status(200).send('Image already exists');
            return;
        }

        const sqlInsert = 'INSERT INTO images (national_id, data) VALUES (?, ?)';
        connection.query(sqlInsert, [nationalId, image], (err) => {
            if (err) {
                console.error('Error inserting image into database:', err);
                res.status(500).send('Error uploading image');
                return;
            }
            console.log('Image inserted into database');
            res.status(200).send('Image uploaded successfully');
        });
    });
});

app.get('/personInfo', (req, res) => {
    const nationalId = req.query.nationalId;
    console.log('Received request for national ID:', nationalId);

    // Fetch user information based on the nationalId from the database
    const sql = 'SELECT * FROM users WHERE national_id = ?';
    console.log('SQL Query:', sql); // Log the SQL query
    console.log('National ID to query:', nationalId); // Log the received nationalId
    connection.query(sql, [nationalId], (err, results) => {
        if (err) {
            console.error('Error fetching user information:', err);
            res.status(500).send('Error fetching user information');
        } else {
            if (results.length === 0) {
                res.status(404).send('User not found');
            } else {
                const userData = results[0];
                res.status(200).json({ user: userData });
            }
        }
    });
});



app.get('/getUserDetails/:nationalId', (req, res) => {
    const nationalId = req.params.nationalId;
    console.log('Received request for national ID:', nationalId);

    const sql = 'SELECT * FROM users WHERE national_id = ?';
    connection.query(sql, [nationalId], (err, results) => {
        if (err) {
            console.error('Error fetching user details:', err);
            res.status(500).send('Error fetching user details');
            return;
        }
        console.log('Query results:', results);

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json(results[0]);
    });
});

app.post('/modifyUser', modifyUser);

function modifyUser(req, res) {
    const {
        national_id, last_name, first_name, date_of_adding, age, phone_number, gender, condition_type} = req.body;

    const sql = `
       UPDATE users 
        SET 
            last_name = ?,
            first_name = ?,
            date_of_adding = ?,
            age = ?,
            phone_number = ?,
            gender = ?,
            condition_type = ?
        WHERE 
            national_id = ?
    `;

    connection.query(
        sql, [last_name, first_name, date_of_adding, age, phone_number, gender, condition_type, national_id],
        (err, result) => {
            if (err) {
                console.error('Error modifying user:', err);
                res.status(500).send('Error modifying user in MySQL');
            } else {
                console.log('User modified in MySQL');
                res.status(200).send('User modified successfully');
            }
        }
    );
}







app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const authSql = 'SELECT role FROM login WHERE username = ? AND password = ?';
    connection.query(authSql, [username, password], (err, results) => {
        if (err) {
            // Handle query error
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                // Handle invalid credentials
                res.status(401).json({ error: 'Invalid credentials' });
            } else {
                const role = results[0].role;
                globalRole = role; // Set the role in the global variable


                let redirectURL = '/main.html';
                res.redirect(redirectURL);
            }
        }
    });
});



app.get('/personnes', (req, res) => {
    connection.query('SELECT national_id, last_name, first_name FROM users', (err, rows) => {
        if (err) {
            // Gérer l'erreur ici
            console.error('Erreur lors de la récupération des données:', err);
            res.status(500).send('Erreur de serveur');
            return;
        }
        res.json(rows);
    });

});

app.post('/enregistrerPrix', (req, res) => {
    const prixData = req.body;
    const updateQueries = prixData.map(item => mysql.format('UPDATE comptabilite SET prix = ? WHERE national_id = ?', [item.prix, item.nationalId]));

    connection.beginTransaction(err => {
        if (err) {
            console.error('Erreur lors du début de la transaction:', err);
            res.status(500).send('Erreur de serveur');
            return;
        }

        updateQueries.forEach(query => {
            connection.query(query, err => {
                if (err) {
                    connection.rollback(() => {
                        console.error('Erreur lors de la mise à jour du prix:', err);
                        res.status(500).send('Erreur de serveur');
                    });
                    return;
                }
            });
        });

        connection.commit(err => {
            if (err) {
                connection.rollback(() => {
                    console.error('Erreur lors de la validation de la transaction:', err);
                    res.status(500).send('Erreur de serveur');
                });
                return;
            }
            res.status(200).end();
        });
    });
});

// ...






app.get('/getUserDetails/:nationalId', (req, res) => {
    const nationalId = req.params.nationalId;

    const sql = 'SELECT users.*, images.data AS image_data FROM users LEFT JOIN images ON users.national_id = images.national_id WHERE users.national_id = ?';

    connection.query(sql, [nationalId], (err, results) => {
        if (err) {
            console.error('Error fetching user details:', err);
            res.status(500).send('Error fetching user details');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const userData = results[0];
        const userWithImage = {
            ...userData,
            image_data: userData.image_data ? `data:image/jpeg;base64,${userData.image_data.toString('base64')}` : null
        };

        res.json(userWithImage);
    });
});
app.get('/usersWithImages', (req, res) => {
    connection.query('SELECT users.*, images.data AS image_url FROM users LEFT JOIN images ON users.national_id = images.national_id', (error, results) => {
        if (error) {
            console.error('Error fetching users with images:', error);
            res.status(500).json({ error: 'Error fetching users with images' });
        } else {
            res.json({ users: results });
        }
    });
});


app.get('/getPrice/:national_id', (req, res) => {
    const { national_id } = req.params;

    const getPriceQuery = `SELECT prix FROM comptabilite WHERE national_id = (SELECT national_id FROM users WHERE national_id = ?)`;

    connection.query(getPriceQuery, [national_id], (error, results) => {
        if (error) {
            console.error('Error fetching price:', error);
            res.status(500).json({ error: 'Error fetching price' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Price not found' });
            return;
        }

        const price = results[0].prix;
        res.json({ price }); // Assuming the response format { "price": 50.00 }
    });
});

app.get('/totalPrice', (req, res) => {
    const getTotalPriceQuery = 'SELECT SUM(prix) AS total FROM comptabilite'; // Assuming 'prix' is the column storing prices

    connection.query(getTotalPriceQuery, (error, results) => {
        if (error) {
            console.error('Error fetching total price:', error);
            res.status(500).json({ error: 'Error fetching total price' });
            return;
        }

        const totalPrice = results[0].total || 0;
        res.json({ totalPrice });
    });
});



app.get('/getDataFromServer', (req, res) => {
    const sql = 'SELECT images.national_id, images.data, users.first_name, users.last_name FROM images LEFT JOIN users ON images.national_id = users.national_id';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).json({ error: 'Error fetching data' });
        } else {
            const dataWithBase64 = results.map(item => ({
                national_id: item.national_id,
                imageUrl: `data:image/jpeg;base64,${item.data.toString('base64')}`,
                name: `${item.first_name} ${item.last_name}`
            }));

            res.json(dataWithBase64);
        }
    });
});

// Endpoint to fetch medical patients
app.get('/getMedicalPatients', (req, res) => {
    const sql = 'SELECT images.national_id, images.data, users.first_name, users.last_name FROM images LEFT JOIN users ON images.national_id = users.national_id WHERE users.condition_type = "medical"';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching medical patients:', err);
            res.status(500).json({ error: 'Error fetching medical patients' });
        } else {
            const dataWithBase64 = results.map(item => ({
                national_id: item.national_id,
                imageUrl: `data:image/jpeg;base64,${item.data.toString('base64')}`,
                name: `${item.first_name} ${item.last_name}`,
                type: 'medical' // Add the type attribute for medical patients
            }));
            res.json(dataWithBase64);
        }
    });
});

// Endpoint to fetch surgical patients
app.get('/getSurgicalPatients', (req, res) => {
    const sql = 'SELECT images.national_id, images.data, users.first_name, users.last_name FROM images LEFT JOIN users ON images.national_id = users.national_id WHERE users.condition_type = "chirurgical"';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching surgical patients:', err);
            res.status(500).json({ error: 'Error fetching surgical patients' });
        } else {
            const dataWithBase64 = results.map(item => ({
                national_id: item.national_id,
                imageUrl: `data:image/jpeg;base64,${item.data.toString('base64')}`,
                name: `${item.first_name} ${item.last_name}`,
                type: 'surgical' // Add the type attribute for surgical patients
            }));
            res.json(dataWithBase64);
        }
    });
});


app.post('/fileattente', (req, res) => {
    const { nom, date, heure } = req.body;
    const query = `INSERT INTO file_attente (nom, date, heure) VALUES ('${nom}', '${date}', '${heure}')`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error adding to waiting list:', error);
            res.status(500).json({ success: false, error: 'Failed to add to waiting list' });
        } else {
            res.status(200).json({ success: true, message: 'Added to waiting list successfully' });
        }
    });
});

// Endpoint pour fixer un rendez-vous futur
app.post('/rendezvousfuturs', (req, res) => {
    const { nom, date, heure } = req.body;
    const query = `INSERT INTO rendez_vous_futurs (nom, date, heure) VALUES ('${nom}', '${date}', '${heure}')`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fixing future appointment:', error);
            res.status(500).json({ success: false, error: 'Failed to fix future appointment' });
        } else {
            res.status(200).json({ success: true, message: 'Fixed future appointment successfully' });
        }
    });
});
// Route GET pour récupérer les données de la file d'attente
app.get('/fileAttenteData', (req, res) => {
    // Récupérer la date d'aujourd'hui au format SQL (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);

    const query = `SELECT nom, date, heure FROM file_attente WHERE date = '${today}'`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error('Error fetching data from file_attente:', err);
            res.status(500).send('Error fetching data from file_attente');
            return;
        }
        res.json(rows); // Renvoie les données au format JSON
    });
});


// Route GET pour récupérer les données des rendez-vous futurs
app.get('/rdvFutursData', (req, res) => {
    // Récupérer la date d'aujourd'hui au format SQL (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);

    const query = `SELECT nom, date, heure FROM rendez_vous_futurs WHERE date >= '${today}'`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error('Error fetching data from rendez_vous_futurs:', err);
            res.status(500).send('Error fetching data from rendez_vous_futurs');
            return;
        }
        res.json(rows); // Renvoie les données au format JSON
    });
});



app.get('/rendezvousaujourdhui', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui en format YYYY-MM-DD
    const query = `SELECT * FROM rendez_vous_futurs WHERE date = '${today}'`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des rendez-vous du jour :', error);
            res.status(500).json({ success: false, error: 'Échec de la récupération des rendez-vous du jour' });
        } else {
            res.status(200).json({ success: true, appointments: results });
        }
    });
});

app.get('/rdvFutursDataa', (req, res) => {
    connection.query('SELECT nom, CONCAT(date, " ", heure) AS datetime FROM rendez_vous_futurs', (err, rows) => {
        if (err) {
            console.error('Error fetching data from rendez_vous_futurs:', err);
            res.status(500).send('Error fetching data from rendez_vous_futurs');
            return;
        }

        const events = rows.map(row => ({
            title: row.nom,
            start: row.datetime,
            description: `Name: ${row.nom}, DateTime: ${row.datetime}`
        }));

        res.json(events);
    });
});



app.get('/beds', (req, res) => {
    const query = 'SELECT * FROM beds'; // Query to fetch all beds
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching beds:', err);
            res.status(500).json({ error: 'Error fetching beds' });
        } else {
            console.log('Beds:', results); // Log the fetched data
            const formattedResults = results.map(bed => ({ id: bed.id, bed_number: bed.bed_number, status: bed.status }));
            res.json(formattedResults); // Send formatted data as JSON response
        }
    });
});

app.get('/bloc_operatoire', (req, res) => {
    const query = 'SELECT * FROM bloc_operatoire'; // Fetch all Bloc Opératoire statuses
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Bloc Opératoire status:', err);
            res.status(500).json({ error: 'Error fetching Bloc Opératoire status' });
        } else {
            console.log('Bloc Opératoire Status:', results); // Log the fetched data
            res.json(results);
        }
    });
});



app.put('/beds/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE beds SET status = ? WHERE id = ?';
    connection.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Error updating bed status:', err);
            res.status(500).json({ error: 'Error updating bed status' });
        } else {
            console.log('Bed status updated:', results);
            res.json({ message: 'Bed status updated successfully' });
        }
    });
});


// Endpoint to update bloc operatoire status
app.put('/bloc_operatoire/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE bloc_operatoire SET status = ? WHERE id = ?';
    connection.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Error updating bloc operatoire status:', err);
            res.status(500).json({ error: 'Error updating bloc operatoire status' });
        } else {
            console.log('Bloc operatoire status updated:', results);
            res.json({ message: 'Bloc operatoire status updated successfully' });
        }
    });
});


app.post('/savecons', (req, res) => {
    const { id,Num_Consultation, Date, Symptome, Hypertension_Arterielle, Diabete, Remarque, National_id } = req.body;

    connection.query(
        'INSERT INTO dossier (Num_Consultation, Date, Symptome, Hypertension_Arterielle, Diabete, Remarque, National_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Num_Consultation, Date, Symptome, Hypertension_Arterielle, Diabete, Remarque, National_id],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).json({ success: false, error: 'Failed to save treatment data' });
            } else {
                console.log('Treatment data inserted successfully');
                res.status(200).json({ success: true, message: 'Treatment data saved successfully' });
            }
        }
    );
});



app.get('/appelcons', (req, res) => {
    const nationalId = req.query.nationalId; // Fetch the nationalId from the query parameters

    // Adjust the SQL query to filter results based on the nationalId
    connection.query(
        'SELECT id ,Num_Consultation, National_id, Date, Symptome, Hypertension_Arterielle, Diabete, Remarque FROM dossier WHERE National_id = ?',
        [nationalId],
        (err, rows) => {
            if (err) {
                console.error('Error fetching data from dossier:', err);
                res.status(500).send('Error fetching data from dossier');
                return;
            }
            res.json(rows);
        }
    );
});



app.delete('/deleteConsultation/:id', (req, res) => {
    const { id } = req.params;

    connection.query(
        'DELETE FROM dossier WHERE id = ?',
        [id],
        (error, results) => {
            if (error) {
                console.error('Error deleting consultation:', error);
                res.status(500).json({ success: false, error: 'Failed to delete consultation' });
            } else {
                console.log('Consultation deleted successfully');
                res.status(200).json({ success: true, message: 'Consultation deleted successfully' });
            }
        }
    );
});





app.post('/savegraphe', upload.single('PhotoGraphe'), (req, res) => {
    const { Nbr_Graphe, Date_Graph, National_id } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null; // Retrieve the image buffer

    connection.query(
        'INSERT INTO graphe (Nbr_Graphe, Date_Graph, National_id, Photo_graphe) VALUES (?, ?, ?, ?)',
        [Nbr_Graphe, Date_Graph, National_id, imageBuffer],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).json({ success: false, error: 'Failed to save graphe data' });
            } else {
                console.log('Graphe data inserted successfully');
                res.status(200).json({ success: true, message: 'Graphe data saved successfully' });
            }
        }
    );
});

app.get('/appelgraphe', (req, res) => {
    const nationalId = req.query.nationalId;
    connection.query('SELECT id, Nbr_Graphe, Date_Graph, Photo_graphe FROM graphe WHERE National_id = ?', nationalId, (err, rows) => {
        if (err) {
            console.error('Error fetching data from graphe:', err);
            res.status(500).send('Error fetching data from graphe');
            return;
        }
        // Convert image buffer to base64 string
        const formattedRows = rows.map(row => {
            return {
                Nbr_Graphe: row.Nbr_Graphe,
                Date_Graph: row.Date_Graph,
                Photo_graphe: row.Photo_graphe ? `data:image/jpeg;base64,${row.Photo_graphe.toString('base64')}` : null
            };
        });
        res.json(formattedRows);
    });
});



app.delete('/deletegraphe/:Nbr_Graphe', (req, res) => {
    const { Nbr_Graphe } = req.params;

    // Perform deletion of consultation with the provided numConsultation
    // Execute the SQL DELETE query to remove the record from the database

    connection.query(
        'DELETE FROM graphe WHERE Nbr_Graphe = ?',
        [Nbr_Graphe],
        (error, results) => {
            if (error) {
                console.error('Error deleting consultation:', error);
                res.status(500).json({ success: false, error: 'Failed to delete consultation' });
            } else {
                console.log('Consultation deleted successfully');
                res.status(200).json({ success: true, message: 'Consultation deleted successfully' });
            }
        }
    );
});




app.post('/saveanalyse', upload.single('Photo_analyse'), (req, res) => {
    const { Nbr, Dateanalyse, National_id } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null; // Retrieve the image buffer

    connection.query(
        'INSERT INTO analyse (Nbr, Dateanalyse, National_id, Photo_analyse) VALUES (?, ?, ?, ?)',
        [Nbr, Dateanalyse, National_id, imageBuffer],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).json({ success: false, error: 'Failed to save analyse data' });
            } else {
                console.log('Analyse data inserted successfully');
                res.status(200).json({ success: true, message: 'Analyse data saved successfully' });
            }
        }
    );
});

app.get('/appelanalyse', (req, res) => {
    const nationalId = req.query.nationalId;

    connection.query('SELECT id ,Nbr, Dateanalyse, Photo_analyse FROM analyse WHERE National_id = ?', [nationalId], (err, rows) => {
        if (err) {
            console.error('Error fetching data from analyse:', err);
            res.status(500).send('Error fetching data from Analyse');
            return;
        }

        // Handling potential null or undefined value in row.Photo_analyse
        rows = rows.map(row => {
            return {
                Nbr: row.Nbr,
                Dateanalyse: row.Dateanalyse,
                Photo_analyse: row.Photo_analyse ? Buffer.from(row.Photo_analyse).toString('base64') : null
            };
        });

        res.json(rows);
    });
});

app.delete('/deleteanalyse/:Nbr', (req, res) => {
    const { Nbr } = req.params;

    connection.query(
        'DELETE FROM analyse WHERE Nbr = ?',
        [Nbr],
        (error, results) => {
            if (error) {
                console.error('Error deleting analyse:', error);
                res.status(500).json({ success: false, error: 'Failed to delete analyse' });
            } else {
                console.log('Analyse deleted successfully');
                res.status(200).json({ success: true, message: 'Analyse deleted successfully' });
            }
        }
    );
});




app.get('/appelanalyse', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/appelcons', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/appelgraphe', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

















app.post('/saveoperation', (req, res) => {
    const { Num_Operation, Type_Operation, Dateo, Heure, Salle, Anesthesie, Instruments, Nbr_infirmiers, National_id } = req.body;

    connection.query(
        'INSERT INTO operation (Num_Operation, Type_Operation, Dateo, Heure, Salle, Anesthesie, Instruments, Nbr_infirmiers, National_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Num_Operation, Type_Operation, Dateo, Heure, Salle, Anesthesie, Instruments, Nbr_infirmiers, National_id],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).json({ success: false, error: 'Failed to save operation data' });
            } else {
                console.log('Operation data inserted successfully');
                res.status(200).json({ success: true, message: 'Operation data saved successfully' });
            }
        }
    );
});



app.get('/appeloperation', (req, res) => {
    const nationalId = req.query.nationalId;

    // Perform the SQL query to retrieve operation data based on the provided nationalId
    connection.query(
        'SELECT id, Num_Operation, Type_Operation, Dateo, Heure, Salle, Anesthesie, Instruments, Nbr_infirmiers FROM operation WHERE National_id = ?',
        [nationalId],
        (err, rows) => {
            if (err) {
                console.error('Error fetching data from operation:', err);
                res.status(500).send('Error fetching data from operation');
                return;
            }
            res.json(rows);
        }
    );
});


// Endpoint to delete an operation
app.delete('/deleteOperation/:id', (req, res) => {
    const { id } = req.params;

    connection.query(
        'DELETE FROM operation WHERE id = ?',
        [id],
        (error, results) => {
            if (error) {
                console.error('Error deleting operation:', error);
                res.status(500).json({ success: false, error: 'Failed to delete operation' });
            } else {
                console.log('Operation deleted successfully');
                res.status(200).json({ success: true, message: 'Operation deleted successfully' });
            }
        }
    );
});


app.get('/appeloperation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'operation.html'));
});






app.use(express.static(path.join(__dirname, 'public')));