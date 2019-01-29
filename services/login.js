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
        formData.append("type", " text/html");
        console.log("Cuerpo: " + JSON.stringify(formData));
        this.request.post({
            "headers": { "content-type": "multipart/form-data" },
            "url": this.servicio,
            /*  "body": JSON.stringify(this.cuerpo) */
            "body": formData,
        }, function (error, response, body) {
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
