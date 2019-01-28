let messagesToSend = {
  newMessage: function (state: string, userName: string, dia?: string, hora?: string, x?: string, objecto?: any, correo?: string) {
    let mensaje = '';


    switch (state) {
      case 'saludoInicial':
        mensaje = `Hola, ${userName} Bienvenido a la linea de atencion de *Comfenalco*.
Por favor dime en que quieres que te ayude utiliza una de las palabras claves: 
      *1.Citas* 📅
      *2.Subsidios* 💵
      *3.Afiliación* 🆘
      *4.Certificados* 📄
      *5.Cancelar* ⏹️`;
        break;
      case 'inicial1':
        mensaje = `${userName} que tipo de cita quieres que se te agende
      *1.General*
      *2.Odontologia* 
      *3.Cancelar* `;
        break;
      case 'inicial2':
        mensaje = `Por favor ${userName} escoje tu tipo de documento: 
      *1.Cédula de ciudadanía*
      *2.Pasaporte* 
      *3.Tarjeta de identidad* 
      *4.Cancelar* ⏹️`;
        break;
      case 'citasSubFlow1':
        mensaje = `Muy bien ${userName}, a hora digita el numero de tu documento (Ejemplo: 1144256257)`;
        break;
      case 'citasSubFlow2':
        mensaje = `Por favor ${userName} digita la fecha de expedicion de tu documento (1990-12-20)`;
        break;
      case 'citasSubFlow3':
        mensaje = `${userName} su numero de documento no se encuentra registrado, por favor intentalo de nuevo`;
        break;
      case 'eligeCita1':
        mensaje = `*${userName}* se a verificado tu documento exitosamente, 
*tu calidad de afiliado es* ${objecto.calidad},
*tu fecha de afiliación* ${objecto.fecha}, 
*tu tipo de afilaición* ${objecto.tipo}.

Estos son los dias que tenemos citas disponibles:
${x}`;
        break;
      case 'eligeCita2':
        mensaje = `${userName} estas son las horas en que tenemos citas disponibles
      *1. 8:00* 
      *2. 9:00* 
      *3. 3:30* 
      *4. 4:20* 
      *5.Cancelar*`;
        break;
      case 'eligeCita3':
        mensaje = `${userName} su cita esta para ${dia} a las ${hora} en la sede principal,
        quieres que te enviemos la información a tu correo: ${correo}
      *1. Ok*
      *2. Cancelar*`;
        break;
      case 'eligeCita4':
        mensaje = `Desea que le mandemos esta informacion a su correo: ${correo}
      *1. Si*
      *2. No*`;
        break;
      case 'despedida1':
        mensaje = `Gracias ${userName}, hasta la próxima`;
        break;
      case 'despedida2':
        mensaje = `Bye asta pronto`;
        break;
      case 'eligeCita7':
        mensaje = `${userName} no te entiendo`;
        break;
      case 'docInvalido':
        mensaje = `Por favor ${userName} digita un número de documento válido 
    *Formato: Sin espacios, sin comas, sin letras y sin caractéres especiales*`;
        break;
      case 'docInvalidoFecha':
        mensaje = `Por favor ${userName} digita una fecha de expedicion válida 
    *(1990-12-20)*`;
        break;
      case 'certificados':
        mensaje = `Por favor ${userName} digite su numero de cedula sin puntos ni comas`;
        break;
    }
    return mensaje;
  }
}

module.exports = messagesToSend;
