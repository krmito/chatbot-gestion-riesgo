import express = require('express');
import bodyParser = require('body-parser');
import request = require('request');
import { User } from "./classes/User";
let messagesTosendRiesgo = require("./classes/messageTosendRiesgo");
let utilities = require("./classes/utilities");

let app = express();
let url: string = 'https://eu24.chat-api.com/instance23630/sendMessage?token=fhbjhwk1fvtfy2j4';
let users: Array<any> = [];
let user: User;
let data: any;
let documentNumber: number;
let documentDate: string;
let day: string;
let hour: string;
let message: string;
let saludosInicial: Array<string> = [];
let reporteRiesgo: Array<string[]> = [];
let consultaRiesgo: Array<string[]> = [];
let tipoDocumento: Array<string[]> = [];
let DiasDisponibles: Array<string> = [];
let diasDisponibles: Array<string> = [];
let input: string = "";
let senderName: string;
let datos: any;
let chatId: string;
let fromMe: boolean;
let elementUser: User;
let indexUser: number;
let fechaActual = new Date();
let dia = fechaActual.getDate();
let mes = fechaActual.getMonth();
let anio = fechaActual.getFullYear();
let mesString: string;
let correo: string;
let existeAfiliado: boolean;

let horasDisponibles: Array<string> = [];
let arregloDias: Array<any> = [];
let myArray: Array<any> = [];

app.use(bodyParser.json());

app.post('/my_webhook_url', (req, res) => {
    data = req.body; // New messages in the "body" variable

    console.log('ELEMENT', data);
    //servicioAfiliadoEPS.armaObjetos("CC", "1107063182")

    utilities.functionWithCallBack(checkMessage(), 1000).then((res: any) => {
        console.log('res--------------------------------->', res);
        if (res) {
            subFlow();
        }
    });
    res.sendStatus(200); //Response does not matter
});


function checkMessage() {

    reporteRiesgo = [["r", "riesgo"]];
    consultaRiesgo = [["c", "consulta"]];
    saludosInicial = ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"];
    tipoDocumento = [["1", "cédula de ciudadanía"], ["2", "pasaporte"], ["3", "tarjeta de identidad"], ["4", "cancelar"]];
    horasDisponibles = ["8:00", "9:00", "3:30", "4:20", "cancelar"];

    data.messages.forEach((element: any) => {
        input = element.body;
        input = input.toLocaleLowerCase().trim();
        senderName = element.senderName;
        chatId = element.chatId;
        fromMe = element.fromMe
    });


    console.log('users', users);
    if (users.find(userValue => userValue.chatId == chatId) && !fromMe) {
        if (saludosInicial.find(valueSaludo1 => valueSaludo1 == input)) {
            message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'saludoInicial' && reporteRiesgo[0].find(valueCita => utilities.isContain(input, valueCita))) {
            input = '';
            message = messagesTosendRiesgo.newMessage('DescReporte', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'DescReporte';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'saludoInicial' && reporteRiesgo[4].find(valueCancel => utilities.isContain(input, valueCancel))) {
            myArray = [
                messagesTosendRiesgo.newMessage('despedida1', senderName),
                messagesTosendRiesgo.newMessage('despedida2', senderName)
            ];

            let randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
            user = users.find(userValue => userValue.chatId == chatId);
            user.body = randomMessage;
            sendMessage(user, (x: any) => {
            });
            users.splice(users.indexOf(user), 1);
        }
    } else if (saludosInicial.find(valueSaludo2 => valueSaludo2 == input)) {
        message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
        user = new User(chatId, message, 'saludoInicial')
        users.push(user);
        sendMessage(user, (x: any) => { });
    }
}

function subFlow() {
    if (users.find(userValue => userValue.chatId == chatId) && !fromMe) {
        //Ingresa l tipo de documento
        if (user.state == 'DescReporte') {

            message = messagesTosendRiesgo.newMessage('cargarImagen', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'cargarImagen';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'cargarImagen') {
            
            message = messagesTosendRiesgo.newMessage('darUbicacion', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'darUbicacion';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'darUbicacion') {

            documentNumber = parseInt(input);
            message = messagesTosendRiesgo.newMessage('darCategoria', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'darCategoria';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'darCategoria') {

            existeAfiliado = false;
            message = messagesTosendRiesgo.newMessage('darGracias', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'darGracias';
            user.body = message;
            arregloDias = [];
            sendMessage(user, (x: any) => { });

        }

    } else if (user.state == 'darGracias' && existeAfiliado) {

        existeAfiliado = false;
        message = messagesTosendRiesgo.newMessage('repetir', senderName);
        user = users.find(userValue => userValue.chatId == chatId);
        user.state = 'repetir';
        user.body = message;
        arregloDias = [];
        sendMessage(user, (x: any) => { });

    } else if (user.state == 'eligeCita2' && existeAfiliado) {
        horasDisponibles.forEach((element, indice2) => {
            if (Number(indice2) == Number(input)) {
                hour = horasDisponibles[indice2 - 1];

                message = messagesTosendRiesgo.newMessage('eligeCita3', senderName, day, hour, '', '', correo);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'eligeCita3';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }

        });
    } else if (user.state == 'eligeCita3' && existeAfiliado) {

        if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
            message = messagesTosendRiesgo.newMessage('despedida1', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'despedida1';
            user.body = message;
            sendMessage(user, (x: any) => { });
        } else if (Number(input.match(/([^a-zA-Z])/g)) == 2) {
            message = messagesTosendRiesgo.newMessage('eligeCita1', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'eligeCita1';
            user.body = message;
            sendMessage(user, (x: any) => { });
        }

    } else if (user.state == 'despedida1' && existeAfiliado) {
        if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
            message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, (x: any) => { });
            users.push(user);
        }
    }
}


function sendMessage(data: any, callback: any) {
    request({
        url: url,
        method: "POST",
        json: data
    }, function (err, data, response) {
        if (response.sent) {
            callback(data);
        }
    });
}

function availableDates() {
    switch (mes) {
        case 0: { mesString = 'January' } break;
        case 1: { mesString = 'February' } break;
        case 2: { mesString = 'March' } break;
        case 3: { mesString = 'April' } break;
        case 4: { mesString = 'May' } break;
        case 5: { mesString = 'June' } break;
        case 6: { mesString = 'July' } break;
        case 7: { mesString = 'August' } break;
        case 8: { mesString = 'September' } break;
        case 9: { mesString = 'October' } break;
        case 10: { mesString = 'November' } break;
        case 11: { mesString = 'December' } break;
    }

    let diasDisponibles = fechaActual.getDay();
    let contador = 0;
    /// ESTO ES EN CASO DE QUE EL HORARIO DE ATENFCIÓN SEA DE LUNES A VIERNES, EN CAOS DE QUE SE VA ATENDER FINES DE SEMANA HAY QUE HACER ALGO ADICIONAL
    for (let i = diasDisponibles; i <= 5; i++) {
        if (i == diasDisponibles) {
            arregloDias.push({ "text": 'Hoy ' + utilities.diaSemana(dia, mesString, anio) + ' ' + dia + '/' + (fechaActual.getMonth() + 1) + '/' + anio });
        } else if (i > diasDisponibles) {
            arregloDias.push({ "text": utilities.diaSemana(dia + contador, mesString, anio) + ' ' + (dia + contador) + '/' + (fechaActual.getMonth() + 1) + '/' + anio });
        }
        contador++;
    }
}

/* function consultarServicio(tipo: string, cedula: number) {
    consultaAfiliadoEPS.servicioAfiliadoEPS.armaObjetos(tipo, cedula, (x: any) => {
        datos = x;
    });
} */

let server = app.listen(process.env.PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
