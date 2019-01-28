"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var User_1 = require("./classes/User");
var messagesTosendRiesgo = require("./classes/messageTosendRiesgo");
var utilities = require("./classes/utilities");
var app = express();
var url = 'https://eu24.chat-api.com/instance23630/sendMessage?token=fhbjhwk1fvtfy2j4';
var users = [];
var user;
var data;
var documentNumber;
var documentDate;
var day;
var hour;
var message;
var saludosInicial = [];
var reporteRiesgo = [];
var consultaRiesgo = [];
var tipoDocumento = [];
var DiasDisponibles = [];
var diasDisponibles = [];
var input = "";
var senderName;
var datos;
var chatId;
var fromMe;
var elementUser;
var indexUser;
var fechaActual = new Date();
var dia = fechaActual.getDate();
var mes = fechaActual.getMonth();
var anio = fechaActual.getFullYear();
var mesString;
var correo;
var existeAfiliado;
var horasDisponibles = [];
var categoriasRiesgo = [];
var arregloDias = [];
var myArray = [];
var repetir = [];
var NoRepetir = [];
app.use(bodyParser.json());
app.post('/my_webhook_url', function (req, res) {
    data = req.body; // New messages in the "body" variable
    console.log('ELEMENT', data);
    //servicioAfiliadoEPS.armaObjetos("CC", "1107063182")
    utilities.functionWithCallBack(checkMessage(), 1000).then(function (res) {
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
    data.messages.forEach(function (element) {
        input = element.body;
        input = input.toLocaleLowerCase().trim();
        senderName = element.senderName;
        chatId = element.chatId;
        fromMe = element.fromMe;
    });
    console.log('users', users);
    if (users.find(function (userValue) { return userValue.chatId == chatId; }) && !fromMe) {
        if (saludosInicial.find(function (valueSaludo1) { return valueSaludo1 == input; })) {
            message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
            user = users.find(function (userValue) { return userValue.chatId == chatId; });
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, function (x) { });
        }
        else if (user.state == 'saludoInicial' && reporteRiesgo[0].find(function (valueCita) { return utilities.isContain(input, valueCita); })) {
            input = '';
            message = messagesTosendRiesgo.newMessage('DescReporte', senderName);
            user = users.find(function (userValue) { return userValue.chatId == chatId; });
            user.state = 'DescReporte';
            user.body = message;
            sendMessage(user, function (x) { });
        }
        else if (user.state == 'saludoInicial' && reporteRiesgo[4].find(function (valueCancel) { return utilities.isContain(input, valueCancel); })) {
            myArray = [
                messagesTosendRiesgo.newMessage('despedida1', senderName),
                messagesTosendRiesgo.newMessage('despedida2', senderName)
            ];
            var randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
            user = users.find(function (userValue) { return userValue.chatId == chatId; });
            user.body = randomMessage;
            sendMessage(user, function (x) {
            });
            users.splice(users.indexOf(user), 1);
        }
    }
    else if (saludosInicial.find(function (valueSaludo2) { return valueSaludo2 == input; })) {
        message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
        user = new User_1.User(chatId, message, 'saludoInicial');
        users.push(user);
        sendMessage(user, function (x) { });
    }
}
function subFlow() {
    if (users.find(function (userValue) { return userValue.chatId == chatId; }) && !fromMe) {
        //Ingresa l tipo de documento
        console.log("Ingresó aquí");
        if (user.state == 'DescReporte') {
            if (input.match(/([a-zA-Z])/g) || input.match(/([0-9])/g)) {
                message = messagesTosendRiesgo.newMessage('cargarImagen', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'cargarImagen';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'cargarImagen') {
            if (input.match(/([.])*\.(?:jpg|gif|png|jpeg)/g)) {
                message = messagesTosendRiesgo.newMessage('darUbicacion', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'darUbicacion';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else {
                message = messagesTosendRiesgo.newMessage('imagenValida', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'cargarImagen';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'darUbicacion') {
            if (input.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?);\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)) {
                documentNumber = parseInt(input);
                message = messagesTosendRiesgo.newMessage('darCategoria', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'darCategoria';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else {
                message = messagesTosendRiesgo.newMessage('ubicacionValida', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'darUbicacion';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'darCategoria') {
            if (categoriasRiesgo[0].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[0].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[1].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[2].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[3].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[4].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[5].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[6].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[7].find(function (response) { return utilities.isContain(input, response); }) ||
                categoriasRiesgo[8].find(function (response) { return utilities.isContain(input, response); })) {
                message = messagesTosendRiesgo.newMessage('darGracias', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'darGracias';
                user.body = message;
                utilities.functionWithCallBack(sendMessage(user, function (x) { }), 3000).then(function (res) {
                    message = messagesTosendRiesgo.newMessage('repetirRiesgo', senderName);
                    user = users.find(function (userValue) { return userValue.chatId == chatId; });
                    user.state = 'repetirRiesgo';
                    user.body = message;
                    sendMessage(user, function (x) { });
                });
            }
            else {
                message = messagesTosendRiesgo.newMessage('cateValida', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'darCategoria';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'repetirRiesgo') {
            console.log("Entró a repetir");
            if (repetir.find(function (valueRepetir) { return valueRepetir == input; })) {
                message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'saludoInicial';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else if (NoRepetir.find(function (valueRepetir) { return valueRepetir == input; })) {
                //message = messagesTosendRiesgo.newMessage('repetir', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'saludoInicial';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'eligeCita2' && existeAfiliado) {
            horasDisponibles.forEach(function (element, indice2) {
                if (Number(indice2) == Number(input)) {
                    hour = horasDisponibles[indice2 - 1];
                    message = messagesTosendRiesgo.newMessage('eligeCita3', senderName, day, hour, '', '', correo);
                    user = users.find(function (userValue) { return userValue.chatId == chatId; });
                    user.state = 'eligeCita3';
                    user.body = message;
                    sendMessage(user, function (x) { });
                }
            });
        }
        else if (user.state == 'eligeCita3' && existeAfiliado) {
            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesTosendRiesgo.newMessage('despedida1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'despedida1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else if (Number(input.match(/([^a-zA-Z])/g)) == 2) {
                message = messagesTosendRiesgo.newMessage('eligeCita1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'eligeCita1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'despedida1' && existeAfiliado) {
            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesTosendRiesgo.newMessage('saludoInicial', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'saludoInicial';
                user.body = message;
                sendMessage(user, function (x) { });
                users.push(user);
            }
        }
    }
}
function sendMessage(data, callback) {
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
        case 0:
            {
                mesString = 'January';
            }
            break;
        case 1:
            {
                mesString = 'February';
            }
            break;
        case 2:
            {
                mesString = 'March';
            }
            break;
        case 3:
            {
                mesString = 'April';
            }
            break;
        case 4:
            {
                mesString = 'May';
            }
            break;
        case 5:
            {
                mesString = 'June';
            }
            break;
        case 6:
            {
                mesString = 'July';
            }
            break;
        case 7:
            {
                mesString = 'August';
            }
            break;
        case 8:
            {
                mesString = 'September';
            }
            break;
        case 9:
            {
                mesString = 'October';
            }
            break;
        case 10:
            {
                mesString = 'November';
            }
            break;
        case 11:
            {
                mesString = 'December';
            }
            break;
    }
    var diasDisponibles = fechaActual.getDay();
    var contador = 0;
    /// ESTO ES EN CASO DE QUE EL HORARIO DE ATENFCIÓN SEA DE LUNES A VIERNES, EN CAOS DE QUE SE VA ATENDER FINES DE SEMANA HAY QUE HACER ALGO ADICIONAL
    for (var i = diasDisponibles; i <= 5; i++) {
        if (i == diasDisponibles) {
            arregloDias.push({ "text": 'Hoy ' + utilities.diaSemana(dia, mesString, anio) + ' ' + dia + '/' + (fechaActual.getMonth() + 1) + '/' + anio });
        }
        else if (i > diasDisponibles) {
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
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
