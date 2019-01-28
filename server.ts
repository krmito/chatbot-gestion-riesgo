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
let categoriasRiesgo: Array<string[]> = [];
let arregloDias: Array<any> = [];
let myArray: Array<any> = [];
let repetir: Array<string> = [];
let NoRepetir: Array<string> = [];
app.use(bodyParser.json());

app.post('/my_webhook_url', (req, res) => {
    data = req.body; // New messages in the "body" variable

    console.log('ELEMENT', data);
    //servicioAfiliadoEPS.armaObjetos("CC", "1107063182")

    utilities.functionWithCallBack(checkMessage(), 1000).then((res: any) => {
        console.log('res--------------------------------->', res);
        subFlow();

    });
    res.sendStatus(200); //Response does not matter
});


function checkMessage() {

    reporteRiesgo = [["r", "riesgo"]];
    consultaRiesgo = [["c", "consulta"]];
    saludosInicial = ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"];
    tipoDocumento = [["1", "cédula de ciudadanía"], ["2", "pasaporte"], ["3", "tarjeta de identidad"], ["4", "cancelar"]];
    horasDisponibles = ["8:00", "9:00", "3:30", "4:20", "cancelar"];
    categoriasRiesgo = [
        ["1", "Rios", "alcantarillado", "canales de agua", "inundaciones"],
        ["2", "Incendios"],
        ["3", "Invasión en zonas no permitidas", "invasin", "invasion"],
        ["4", "Energía", "cableado", "Postes de luz", "telefonía", "Televisión"],
        ["5", "Edificicaciones", "viviendas", "calles", "estructuras en mal estado"],
        ["6", "Accidentes de tránsito", "problemas de salud"],
        ["7", "Seguridad y justicia", "robos", "riñas", "atentados"],
        ["8", "Deslizamientos de tierra", "sismos"],
        ["9", "otros"]
    ];
    repetir = ["si", "s"];
    NoRepetir = ["no", "n"];

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
        console.log("Ingresó aquí");

        if (user.state == 'DescReporte') {

            if (input.match(/([a-zA-Z0-9])/g)) {

                message = messagesTosendRiesgo.newMessage('cargarImagen', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'cargarImagen';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }

        } else if (user.state == 'cargarImagen') {
            if (input.match(/([.])*\.(?:jpg|gif|png|jpeg)/g)) {

                message = messagesTosendRiesgo.newMessage('darUbicacion', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'darUbicacion';
                user.body = message;
                sendMessage(user, (x: any) => { });

            } else {

                message = messagesTosendRiesgo.newMessage('imagenValida', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'cargarImagen';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }

        } else if (user.state == 'darUbicacion') {

            if (input.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?);\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)) {
                documentNumber = parseInt(input);
                message = messagesTosendRiesgo.newMessage('darCategoria', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'darCategoria';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else {

                message = messagesTosendRiesgo.newMessage('ubicacionValida', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'darUbicacion';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }


        } else if (user.state == 'darCategoria') {

            if (categoriasRiesgo[0].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[0].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[1].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[2].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[3].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[4].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[5].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[6].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[7].find(response => utilities.isContain(input, response)) ||
                categoriasRiesgo[8].find(response => utilities.isContain(input, response))) {

                message = messagesTosendRiesgo.newMessage('darGracias', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'darGracias';
                user.body = message;
                sendMessage(user, (x: any) => { });
            } else {
                message = messagesTosendRiesgo.newMessage('cateValida', senderName);
                user = users.find(userValue => userValue.chatId == chatId);
                user.state = 'darCategoria';
                user.body = message;
                sendMessage(user, (x: any) => { });
            }
        }

    } else if (user.state == 'darGracias') {
        if (repetir.find(valueRepetir => valueRepetir == input)) {
            message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, (x: any) => { });
        } else if (NoRepetir.find(valueRepetir => valueRepetir == input)) {
            //message = messagesTosendRiesgo.newMessage('repetir', senderName);
            user = users.find(userValue => userValue.chatId == chatId);
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, (x: any) => { });
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
