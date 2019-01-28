"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var User_1 = require("./classes/User");
var consultaAfiliadoEPS = require("./services/consultaAfiliadoEPS");
var messagesToSend = require("./classes/messagesToSend");
var utilities = require("./classes/utilities");
var app = express();
var url = 'https://eu11.chat-api.com/instance20204/sendMessage?token=linoijx5h4glyl4b';
var users = [];
var user;
var data;
var documentNumber;
var documentDate;
var day;
var hour;
var message;
var saludosInicial = [];
var inicial1 = [];
var inicial2 = [];
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
var arregloDias = [];
var myArray = [];
app.use(bodyParser.json());
app.post('/my_webhook_url', function (req, res) {
    data = req.body; // New messages in the "body" variable
    console.log('ELEMENT', data);
    //servicioAfiliadoEPS.armaObjetos("CC", "1107063182")
    utilities.functionWithCallBack(checkMessage(), 1000).then(function (res) {
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
    data.messages.forEach(function (element) {
        input = element.body;
        input = input.toLocaleLowerCase().trim();
        senderName = element.senderName;
        chatId = element.chatId;
        fromMe = element.fromMe;
    });
    console.log('users', users);
    console.log('inicial1', inicial1[0]);
    if (users.find(function (userValue) { return userValue.chatId == chatId; }) && !fromMe) {
        if (saludosInicial.find(function (valueSaludo1) { return valueSaludo1 == input; })) {
            message = messagesToSend.newMessage('saludoInicial', senderName);
            user = users.find(function (userValue) { return userValue.chatId == chatId; });
            user.state = 'saludoInicial';
            user.body = message;
            sendMessage(user, function (x) { });
        }
        else if (user.state == 'saludoInicial' && inicial1[0].find(function (valueCita) { return utilities.isContain(input, valueCita); })) {
            console.log('hey mans ');
            input = '';
            message = messagesToSend.newMessage('inicial1', senderName);
            user = users.find(function (userValue) { return userValue.chatId == chatId; });
            user.state = 'inicial1';
            user.body = message;
            sendMessage(user, function (x) { });
        }
        else if (user.state == 'saludoInicial' && inicial1[4].find(function (valueCancel) { return utilities.isContain(input, valueCancel); })) {
            myArray = [
                messagesToSend.newMessage('despedida1', senderName),
                messagesToSend.newMessage('despedida2', senderName)
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
        message = messagesToSend.newMessage('saludoInicial', senderName);
        user = new User_1.User(chatId, message, 'saludoInicial');
        users.push(user);
        sendMessage(user, function (x) { });
    }
}
function subFlow() {
    if (users.find(function (userValue) { return userValue.chatId == chatId; }) && !fromMe) {
        //Ingresa l tipo de documento
        if (user.state == 'inicial1') {
            if (inicial2[0].find(function (response) { return utilities.isContain(input, response); }) || inicial2[1].find(function (response) { return utilities.isContain(input, response); }) || inicial2[2].find(function (response) { return utilities.isContain(input, response); })) {
                console.log('Cant tell man');
                message = messagesToSend.newMessage('inicial2', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'inicial2';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else if (inicial2[2].find(function (valueCancel) { return utilities.isContain(input, valueCancel); })) {
                myArray = [
                    messagesToSend.newMessage('despedida1', senderName),
                    messagesToSend.newMessage('despedida2', senderName)
                ];
                var randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.body = randomMessage;
                sendMessage(user, function (x) {
                });
                users.splice(users.indexOf(user), 1);
            }
        }
        else if (user.state == 'inicial2') {
            if (tipoDocumento[0].find(function (response) { return utilities.isContain(input, response); }) || tipoDocumento[1].find(function (response) { return utilities.isContain(input, response); }) || tipoDocumento[2].find(function (response) { return utilities.isContain(input, response); })) {
                console.log('Cant tell man');
                message = messagesToSend.newMessage('citasSubFlow1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else if (tipoDocumento[3].find(function (valueCancelar) { return utilities.isContain(input, valueCancelar); })) {
                myArray = [
                    messagesToSend.newMessage('despedida1', senderName),
                    messagesToSend.newMessage('despedida2', senderName)
                ];
                var randomMessage = myArray[Math.floor(Math.random() * myArray.length)];
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.body = randomMessage;
                sendMessage(user, function (x) {
                });
                users.splice(users.indexOf(user), 1);
            }
        }
        else if (user.state == 'citasSubFlow1') {
            console.log('this is happening');
            if (input.match(/([^a-zA-Z])/g)) {
                documentNumber = parseInt(input);
                console.log('Cant tell man');
                message = messagesToSend.newMessage('citasSubFlow2', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'citasSubFlow2';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else {
                console.log('HEY BRO!!!!!');
                message = messagesToSend.newMessage('citasSubFlow1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'citasSubFlow2') {
            availableDates();
            //Validda la fecha de expedición
            if (input.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g)) {
                var availableDate_1 = '';
                arregloDias.forEach(function (element, index) {
                    console.log('heyy', index, element);
                    index = index + 1;
                    availableDate_1 += '*' + index + '.' + element.text + '*' + "\n";
                });
                console.log('arregloDias ', arregloDias);
                documentDate = input;
                utilities.functionWithCallBack(consultarServicio("CC", documentNumber), 4000).then(function (res) {
                    console.log("BOOLENAO: ", JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado);
                    if (JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado != undefined) {
                        var afiliado = JSON.parse(datos).responseMessageOut.body.response.consultaAfiliadoResponse.afiliado;
                        var calidadAfiliado = afiliado.calidadAfiliado;
                        var fechaAfiliacion = afiliado.fechaAfiliacionSistema;
                        var tipoAfiliado = afiliado.tipoAfiliado;
                        correo = afiliado.email;
                        var object = { calidad: calidadAfiliado, fecha: fechaAfiliacion, tipo: tipoAfiliado, };
                        console.log("Existe");
                        existeAfiliado = true;
                        message = messagesToSend.newMessage('eligeCita1', senderName, '', '', availableDate_1, object, correo);
                        user = users.find(function (userValue) { return userValue.chatId == chatId; });
                        user.state = 'eligeCita1';
                        user.body = message;
                        arregloDias = [];
                        sendMessage(user, function (x) { });
                    }
                    else {
                        existeAfiliado = false;
                        message = messagesToSend.newMessage('citasSubFlow1', senderName);
                        user = users.find(function (userValue) { return userValue.chatId == chatId; });
                        user.state = 'citasSubFlow1';
                        user.body = message;
                        arregloDias = [];
                        sendMessage(user, function (x) { });
                    }
                });
            }
            else {
                message = messagesToSend.newMessage('docInvalidoFecha', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'citasSubFlow1';
                user.body = message;
                sendMessage(user, function (x) { });
                arregloDias = [];
            }
        }
        else if (user.state == 'eligeCita1' && existeAfiliado) {
            availableDates();
            for (var indices = 0; indices < arregloDias.length; indices++) {
                console.log('indices', indices);
                console.log('arregloDias[indices]', arregloDias[indices]);
                if (Number(indices) + 1 == Number(input)) {
                    day = arregloDias[indices].text;
                    console.log("ENTRÓÓÓÓÓÓÓÓÓÓÓ");
                    message = messagesToSend.newMessage('eligeCita2', senderName, day);
                    user = users.find(function (userValue) { return userValue.chatId == chatId; });
                    user.state = 'eligeCita2';
                    user.body = message;
                    sendMessage(user, function (x) { });
                }
            }
        }
        else if (user.state == 'eligeCita2' && existeAfiliado) {
            horasDisponibles.forEach(function (element, indice2) {
                if (Number(indice2) == Number(input)) {
                    hour = horasDisponibles[indice2 - 1];
                    message = messagesToSend.newMessage('eligeCita3', senderName, day, hour, '', '', correo);
                    user = users.find(function (userValue) { return userValue.chatId == chatId; });
                    user.state = 'eligeCita3';
                    user.body = message;
                    sendMessage(user, function (x) { });
                }
            });
        }
        else if (user.state == 'eligeCita3' && existeAfiliado) {
            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesToSend.newMessage('despedida1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'despedida1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
            else if (Number(input.match(/([^a-zA-Z])/g)) == 2) {
                message = messagesToSend.newMessage('eligeCita1', senderName);
                user = users.find(function (userValue) { return userValue.chatId == chatId; });
                user.state = 'eligeCita1';
                user.body = message;
                sendMessage(user, function (x) { });
            }
        }
        else if (user.state == 'despedida1' && existeAfiliado) {
            if (Number(input.match(/([^a-zA-Z])/g)) == 1) {
                message = messagesToSend.newMessage('saludoInicial', senderName);
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
function consultarServicio(tipo, cedula) {
    consultaAfiliadoEPS.servicioAfiliadoEPS.armaObjetos(tipo, cedula, function (x) {
        datos = x;
    });
}
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("El servidor se encuentra en el puerto " + port + " y el host es " + host);
});
