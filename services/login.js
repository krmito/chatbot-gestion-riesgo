"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormData = require('form-data');
var acceso = /** @class */ (function () {
    function acceso() {
    }
    acceso.armaObjetos = function (tipo, cedula, callback) {
        var formData = new FormData();
        /*         "headers": { "content-type": "multipart/form-data" },
                "url": this.servicio,
                "formData": JSON.stringify(formData) */
        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        console.log("FORM-DATA: " + JSON.stringify(formData));
        var r = this.request.post(this.servicio, formData);
        console.log(JSON.stringify(r));
    };
    acceso.servicio = "https://qa-producto.nexura.com/api/registro/login";
    acceso.cuerpo = {};
    acceso.request = require('request');
    acceso.tipoDocumento = "";
    acceso.fechaExpedicion = "";
    return acceso;
}());
exports.acceso = acceso;
