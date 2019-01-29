var FormData = require('form-data');
export class acceso {

    static servicio = "https://qa-producto.nexura.com/api/registro/login";
    static cuerpo = {}
    static request = require('request');
    static tipoDocumento: string = "";
    static fechaExpedicion: string = "";
    static response: any;

    constructor() { }

    static armaObjetos(tipo: string, cedula: number, callback: any): any {
        var formData = new FormData();
/*         "headers": { "content-type": "multipart/form-data" },
        "url": this.servicio,
        "formData": JSON.stringify(formData) */
        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        console.log("FORM-DATA: " + JSON.stringify(formData));

        let r = this.request.post(this.servicio, formData);
        console.log(JSON.stringify(r));
        
    }
}