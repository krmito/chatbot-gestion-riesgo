const constantes = {

    reporteRiesgo : ["r", "riesgo"],
    consultaRiesgo : ["c", "consulta"],
    saludosInicial : ["hola", "ola", "buena tarde", "buen dia", "buena noche", "qhubo"],
    tipoDocumento : [["1", "cédula de ciudadanía"], ["2", "pasaporte"], ["3", "tarjeta de identidad"], ["4", "cancelar"]],
    horasDisponibles : ["8:00", "9:00", "3:30", "4:20", "cancelar"],
    categoriasRiesgo : [
        ["1", "Rios", "alcantarillado", "canales de agua", "inundaciones"],
        ["2", "Incendios"],
        ["3", "Invasión en zonas no permitidas", "invasin", "invasion"],
        ["4", "Energía", "cableado", "Postes de luz", "telefonía", "Televisión"],
        ["5", "Edificicaciones", "viviendas", "calles", "estructuras en mal estado"],
        ["6", "Accidentes de tránsito", "problemas de salud"],
        ["7", "Seguridad y justicia", "robos", "riñas", "atentados"],
        ["8", "Deslizamientos de tierra", "sismos"],
        ["9", "otros"]
    ],
    repetir : ["si", "s"],
    NoRepetir : ["no", "n"],
}



module.exports = constantes;