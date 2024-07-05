import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';

const app = express();
const port = 3000;

let users = [];

// Buscar usuarios
const fetchRandomUsers = async () => {
    try {
        const response = await axios.get("https://randomuser.me/api/?results=11");
        return response.data.results.map(userData => ({
            id: uuidv4(),
            name: userData.name.first,
            surname: userData.name.last,
            gender: userData.gender,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        }));
    } catch (error) {
        console.error("Error al recuperar los usuarios:", error);
        return [];
    }
};

// registrar 11 nuevos usuarios
app.get('/registro', async (req, res) => {
    try {
        const newUsers = await fetchRandomUsers();
        users.push(...newUsers);

        // Format the response
        const formattedUsers = newUsers.map(user =>
            `Nombre: ${user.name}  -  Apellido: ${user.surname}  -  TimeStamp: ${user.timestamp}<br/>`
        );

        res.status(201).send(formattedUsers.join(''));
    } catch (error) {
        res.status(500).send('Error al registara usuarios');
    }
});

// obtener todos los usuarios registrados
app.get('/usuarios', (req, res) => {
    const groupedUsers = _.groupBy(users, 'gender');
    // filtrar por genero
    let response = '';
    let consoleOutput = '';

    if (groupedUsers.female) {
        response += 'Mujeres:<br/>';
        consoleOutput += 'Mujeres:\n';
        groupedUsers.female.forEach(user => {
            const formattedUser = `Nombre: ${user.name} - Apellido: ${user.surname} - ID: ${user.id.slice(0, 6)} - TimeStamp: ${moment(user.timestamp).format('MMMM Do YYYY, h:mm:ss a')}`;
            response += `${formattedUser}<br/>`;
            consoleOutput += `${formattedUser}\n`;
        });
    }

    if (groupedUsers.male) {
        response += 'Hombres:<br/>';
        consoleOutput += 'Hombres:\n';
        groupedUsers.male.forEach(user => {
            const formattedUser = `Nombre: ${user.name} - Apellido: ${user.surname} - ID: ${user.id.slice(0, 6)} - TimeStamp: ${moment(user.timestamp).format('MMMM Do YYYY, h:mm:ss a')}`;
            response += `${formattedUser}<br/>`;
            consoleOutput += `${formattedUser}\n`;
        });
    }

    // Imprimir en la consola con fondo blanco y texto azul
    console.info(chalk.bgWhite.blue(consoleOutput));

    res.status(200).send(response);
});


app.listen(port, () => {
    console.info(`Servidor corriendo en http://127.0.0.1:${port}`);
});