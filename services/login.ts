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
        console.log("Cuerpo: " + JSON.stringify(formData));

        this.request.post(
            {
                "headers": { "content-type": "multipart/form-data" },
                "url": this.servicio,
                "body": JSON.stringify(formData)
            }, (error: any, response: any, body: any) => {

                console.log("RESPONSE: " + JSON.stringify(response));
                
                if (!error && response.statusCode == 200) {
                    callback(body);
                }
                else {
                    console.log(error);
                }
            });
    }
}