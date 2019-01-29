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

        formData.append('items', new Blob([JSON.stringify({
            login: "mygov@nx.com",
            password: "123456789"
        })], {
                type: "text/html"
            }));

        console.log("Cuerpo: " + formData);
        this.request.post(
            {
                "headers": { "content-type": "multipart/form-data" },
                "url": this.servicio,
                /*  "body": JSON.stringify(this.cuerpo) */
                "Content-Disposition": formData,
            }, (error: any, response: any, body: any) => {

                if (!error && response.statusCode == 200) {
                    callback(body);
                }
                else {
                    console.log(error);
                }
            });
    }
}