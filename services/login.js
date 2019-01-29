"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormData = require('form-data');
var acceso = /** @class */ (function () {
    function acceso() {
    }
    acceso.armaObjetos = function (tipo, cedula, callback) {
        var formData = new FormData();
        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        formData.append("host", "https://qa-producto.nexura.com/api/registro/login");
        console.log("FORM-DATA: " + JSON.stringify(formData));
        this.request.post({
            "headers": { "content-type": "application/json" },
            "url": this.servicio,
            "formData": JSON.stringify(formData)
        }, function (error, response, body) {
            console.log("RESPONSE: " + JSON.stringify(response));
            console.log("BODY: " + JSON.stringify(body));
            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else {
                console.log(error);
            }
        });
    };
    acceso.servicio = "https://qa-producto.nexura.com/api/registro/login";
    acceso.cuerpo = {};
    acceso.request = require('request');
    acceso.tipoDocumento = "";
    acceso.fechaExpedicion = "";
    return acceso;
}());
exports.acceso = acceso;
