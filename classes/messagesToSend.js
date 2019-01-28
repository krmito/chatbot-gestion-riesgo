"use strict";
var messagesToSend = {
    newMessage: function (state, userName, dia, hora, x, objecto, correo) {
        var mensaje = '';
        switch (state) {
            case 'saludoInicial':
                mensaje = "Hola, " + userName + " Bienvenido a la linea de atencion de *Comfenalco*.\nPor favor dime en que quieres que te ayude utiliza una de las palabras claves: \n      *1.Citas* \uD83D\uDCC5\n      *2.Subsidios* \uD83D\uDCB5\n      *3.Afiliaci\u00F3n* \uD83C\uDD98\n      *4.Certificados* \uD83D\uDCC4\n      *5.Cancelar* \u23F9\uFE0F";
                break;
            case 'inicial1':
                mensaje = userName + " que tipo de cita quieres que se te agende\n      *1.General*\n      *2.Odontologia* \n      *3.Cancelar* ";
                break;
            case 'inicial2':
                mensaje = "Por favor " + userName + " escoje tu tipo de documento: \n      *1.C\u00E9dula de ciudadan\u00EDa*\n      *2.Pasaporte* \n      *3.Tarjeta de identidad* \n      *4.Cancelar* \u23F9\uFE0F";
                break;
            case 'citasSubFlow1':
                mensaje = "Muy bien " + userName + ", a hora digita el numero de tu documento (Ejemplo: 1144256257)";
                break;
            case 'citasSubFlow2':
                mensaje = "Por favor " + userName + " digita la fecha de expedicion de tu documento (1990-12-20)";
                break;
            case 'citasSubFlow3':
                mensaje = userName + " su numero de documento no se encuentra registrado, por favor intentalo de nuevo";
                break;
            case 'eligeCita1':
                mensaje = "*" + userName + "* se a verificado tu documento exitosamente, \n*tu calidad de afiliado es* " + objecto.calidad + ",\n*tu fecha de afiliaci\u00F3n* " + objecto.fecha + ", \n*tu tipo de afilaici\u00F3n* " + objecto.tipo + ".\n\nEstos son los dias que tenemos citas disponibles:\n" + x;
                break;
            case 'eligeCita2':
                mensaje = userName + " estas son las horas en que tenemos citas disponibles\n      *1. 8:00* \n      *2. 9:00* \n      *3. 3:30* \n      *4. 4:20* \n      *5.Cancelar*";
                break;
            case 'eligeCita3':
                mensaje = userName + " su cita esta para " + dia + " a las " + hora + " en la sede principal,\n        quieres que te enviemos la informaci\u00F3n a tu correo: " + correo + "\n      *1. Ok*\n      *2. Cancelar*";
                break;
            case 'eligeCita4':
                mensaje = "Desea que le mandemos esta informacion a su correo: " + correo + "\n      *1. Si*\n      *2. No*";
                break;
            case 'despedida1':
                mensaje = "Gracias " + userName + ", hasta la pr\u00F3xima";
                break;
            case 'despedida2':
                mensaje = "Bye asta pronto";
                break;
            case 'eligeCita7':
                mensaje = userName + " no te entiendo";
                break;
            case 'docInvalido':
                mensaje = "Por favor " + userName + " digita un n\u00FAmero de documento v\u00E1lido \n    *Formato: Sin espacios, sin comas, sin letras y sin caract\u00E9res especiales*";
                break;
            case 'docInvalidoFecha':
                mensaje = "Por favor " + userName + " digita una fecha de expedicion v\u00E1lida \n    *(1990-12-20)*";
                break;
            case 'certificados':
                mensaje = "Por favor " + userName + " digite su numero de cedula sin puntos ni comas";
                break;
        }
        return mensaje;
    }
};
module.exports = messagesToSend;
