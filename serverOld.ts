import express = require('express');
import bodyParser = require('body-parser');
import request = require('request');
import { User } from "./classes/User";
import consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
let messagesToSend = require("./classes/messagesToSend");
let utilities = require("./classes/utilities");

let app = express();
let url: string = 'https://eu11.chat-api.com/instance20204/sendMessage?token=linoijx5h4glyl4b';
let users: Array<any> = [];
let user: User;
let data: any;
let documentNumber: number;
let documentDate: string;
let day: string;
let hour: string;
let message: string;
let saludosInicial: Array<string> = [];
let inicial1: Array<string[]> = [];
let inicial2: Array<string[]> = [];
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

    inicial1 = [["1", "cita", "citas"], ["2", "subsidios"], ["3", "afiliacion"], ["4", "certificados"], ["5", "cancelar"]];
    inicial2 = [["1", "general"], ["2", "odontologia"], ["3", "cancelar"]];
    saludosInicial = ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"];
    tipoDocumento = [["1", "cédula de ciudadanía"], ["2", "pasaporte"], ["3", "tarjeta de identidad"], ["4", "cancelar"]];
    /*  DiasDisponibles = ["martes", "miercoles", "jueves", "viernes", "cancelar"]; */
    horasDisponibles = ["8:00", "9:00", "3:30", "4:20", "cancelar"];

    data.messages.forEach((element: any) => {
        input = element.body;
        input = input.toLocaleLowerCase().trim();
        senderName = element.senderName;
        chatId = element.chatId;
        fromMe = element.fromMe
    });


    console.log('users', users);
    console.log('inicial1', inicial1[0])
    if (users.find(userValue => userValue.chatId == chatId) && !fromMe) {
        if (saludosInicial.find(valueSaludo1 => valueSaludo1 == input)) {
            message = messagesToSend.newMessage('saludoInicial', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'saludoInicial' && inicial1[0].find(valueCita => utilities.isContain(input, valueCita))) {
            console.log('hey mans ');
            input = '';
            message = messagesToSend.newMessage('inicial1', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'inicial1';
            user.body = message;
            sendMessage(user, (x: any) => { });

        } else if (user.state == 'saludoInicial' && inicial1[4].find(valueCancel => utilities.isContain(input, valueCancel))) {
            myArray = [
                messagesToSend.newMessage('despedida1', senderName),
                messagesToSend.newMessage('despedida2', senderName)
            ];

            let randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
            user = users.find(userValue => userValue.chatId == chatId);
            user.body = randomMessage;
            sendMessage(user, (x: any) => {
            });
            users.splice(users.indexOf(user), 1);
        }
    } else if (saludosInicial.find(valueSaludo2 => valueSaludo2 == input)) {
        message = messagesToSend.newMessage('saludoInicial', senderName);
        user = new User(chatId, message, 'saludoInicial')
        users.push(user);
        sendMessage(user, (x: any) => { });
    }
}

function subFlow() {
    if (users.find(userValue => userValue.chatId == chatId) && !fromMe) {
        //Ingresa l tipo de documento
        if (user.state == 'inicial1') {
            if (inicial2[0].find(response => utilities.isContain(input, response)) || inicial2[1].find(response => utilities.isContain(input, response)) || inicial2[2].find(response => utilities.isContain(input, response))) {

                console.log('Cant tell man');
                message = messagesToSend.newMessage('inicial2', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'inicial2';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else if (inicial2[2].find(valueCancel => utilities.isContain(input, valueCancel))) {
                myArray = [
                    messagesToSend.newMessage('despedida1', senderName),
                    messagesToSend.newMessage('despedida2', senderName)
                ];

                let randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
                user = users.find(userValue => userValue.chatId == chatId);
                user.body = randomMessage;
                sendMessage(user, (x: any) => {
                });
                users.splice(users.indexOf(user), 1);
            }
        } else if (user.state == 'inicial2') {
            if (tipoDocumento[0].find(response => utilities.isContain(input, response)) || tipoDocumento[1].find(response => utilities.isContain(input, response)) || tipoDocumento[2].find(response => utilities.isContain(input, response))) {

                console.log('Cant tell man');
                message = messagesToSend.newMessage('citasSubFlow1', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else if (tipoDocumento[3].find(valueCancelar => utilities.isContain(input, valueCancelar))) {
                myArray = [
                    messagesToSend.newMessage('despedida1', senderName),
                    messagesToSend.newMessage('despedida2', senderName)
                ];

                let randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
                user = users.find(userValue => userValue.chatId == chatId);
                user.body = randomMessage;
                sendMessage(user, (x: any) => {
                });
                users.splice(users.indexOf(user), 1);

            }
        } else if (user.state == 'citasSubFlow1') {
            console.log('this is happening');
            if (input.match(/([^a-zA-Z])/g)) {

                documentNumber = parseInt(input);
                console.log('Cant tell man');
                message = messagesToSend.newMessage('citasSubFlow2', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'citasSubFlow2';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else {
                console.log('HEY BRO!!!!!');

                message = messagesToSend.newMessage('citasSubFlow1', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }
        } else if (user.state == 'citasSubFlow2') {
            availableDates();
            //Validda la fecha de expedición
            if (input.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g)) {
                let availableDate: string = '';

                arregloDias.forEach((element, index) => {
                    console.log('heyy', index, element);
                    index = index + 1;
                    availableDate += '*' + index + '.' + element.text + '*' + "\n";
                });

                console.log('arregloDias ', arregloDias);

                documentDate = input;

                utilities.functionWithCallBack(consultarServicio("CC", documentNumber), 4000).then((res: any) => {

                    console.log("BOOLENAO: ", JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado);
                    if (JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado != undefined) {
                        let afiliado = JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado;
                        let calidadAfiliado = afiliado.calidadAfiliado;
                        let fechaAfiliacion = afiliado.fechaAfiliacionSistema;
                        let tipoAfiliado = afiliado.tipoAfiliado;
                        correo = afiliado.email;

                        let object = { calidad: calidadAfiliado, fecha: fechaAfiliacion, tipo: tipoAfiliado, };

                        console.log("Existe");
                        existeAfiliado = true;

                        message = messagesToSend.newMessage('eligeCita1', senderName, '', '', availableDate, object, correo);
                        user = users.find(userValue => userValue.chatId == chatId);
                        user.state = 'eligeCita1';
                        user.body = message;
                        arregloDias = [];
                        sendMessage(user, (x: any) => { });

                    } else {
                        existeAfiliado = false;
                        message = messagesToSend.newMessage('citasSubFlow1', senderName);
                        user = users.find(userValue => userValue.chatId == chatId);
                        user.state = 'citasSubFlow1';
                        user.body = message;
                        arregloDias = [];
                        sendMessage(user, (x: any) => { });

                    }
                });

            } else {

                message = messagesToSend.newMessage('docInvalidoFecha', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, (x: any) => { });
                arregloDias = [];
            }
        } else if (user.state == 'eligeCita1' && existeAfiliado) {
            availableDates();
            for (let indices = 0; indices < arregloDias.length; indices++) {
                console.log('indices', indices);
                console.log('arregloDias[indices]', arregloDias[indices]);
                if (Number(indices) + 1 == Number(input)) {
                    day = arregloDias[indices].text;
                    console.log("ENTRÓÓÓÓÓÓÓÓÓÓÓ");

                    message = messagesToSend.newMessage('eligeCita2', senderName, day);
                    user = users.find(userValue => userValue.chatId == chatId);
                    user.state = 'eligeCita2';
                    user.body = message;
                    sendMessage(user, (x: any) => { });
                }
            }
        } else if (user.state == 'eligeCita2' && existeAfiliado) {
            horasDisponibles.forEach((element, indice2) => {
                if (Number(indice2) == Number(input)) {
                    hour = horasDisponibles[indice2 - 1];

                    message = messagesToSend.newMessage('eligeCita3', senderName, day, hour, '', '', correo);
                    user = users.find(userValue => userValue.chatId == chatId);
                    user.state = 'eligeCita3';
                    user.body = message;
                    sendMessage(user, (x: any) => { });
                }

            });
        } else if (user.state == 'eligeCita3' && existeAfiliado) {

            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesToSend.newMessage('despedida1', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'despedida1';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else if (Number(input.match(/([^a-zA-Z])/g)) == 2) {
                message = messagesToSend.newMessage('eligeCita1', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'eligeCita1';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }

        } else if (user.state == 'despedida1' && existeAfiliado) {
            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesToSend.newMessage('saludoInicial', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'saludoInicial';
                user.body = message;
                sendMessage(user, (x: any) => { });
                users.push(user);
            }
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

function consultarServicio(tipo: string, cedula: number) {
    consultaAfiliadoEPS.servicioAfiliadoEPS.armaObjetos(tipo, cedula, (x: any) => {
        datos = x;
    });
}

let server = app.listen(process.env.PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
