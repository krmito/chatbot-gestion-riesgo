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

        formData.append("login", "mygov@nx.com");
        formData.append("password", "123456789");
        /* formData.append("type", "text/html"); */
        console.log("FORM-DATA: " + JSON.stringify(formData));

        this.request.post({
                "headers": { "content-type": "application/json" },
                "url": this.servicio,
                "formData": JSON.stringify(formData)
            }, (error: any, response: any, body: any) => {
                console.log("RESPONSE: " + JSON.stringify(response));
                console.log("BODY: " + JSON.stringify(body));

                if (!error && response.statusCode == 200) {
                    callback(body);
                }
                else {
                    console.log(error);
                }
            });
    }
}