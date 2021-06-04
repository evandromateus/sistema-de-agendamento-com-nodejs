const AppointmentService = require("../services/AppointmentService")

class AppointmentFactory{
    Build(simpleAppointment){

        let day = simpleAppointment.date.getDate()+1
        let month = simpleAppointment.date.getMonth()
        let year = simpleAppointment.date.getFullYear()

        let hour = Number.parseInt(simpleAppointment.time.split(":")[0])
        let minutes = Number.parseInt(simpleAppointment.time.split(":")[1])

        let startDate = new Date(year, month, day, hour, minutes, 0, 0)
        // startDate.setHours( startDate.getHours() - 3 ) horario brasileiro, não necessario com o fullcallendar

        let appo = {
            id: simpleAppointment._id,
            title: simpleAppointment.name + " - " + simpleAppointment.description,
            start: startDate,
            end: startDate,
            notified: simpleAppointment.notified,
            email: simpleAppointment.email
        }

        return appo
    }
}

module.exports = new AppointmentFactory()