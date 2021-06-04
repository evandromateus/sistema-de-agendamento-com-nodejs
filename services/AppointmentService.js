let appointment = require('../models/Appointment')
let mongoose = require('mongoose')
let AppointmentFactory = require('../factories/AppointmentFactory')
let mailer = require('nodemailer')

const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {

    async Create(name, email, description, cpf, date, time){
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        })

        try {
            await newAppo.save()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async GetAll(showFinished){

        if(showFinished){
            return await Appo.find()
        }else{
            let appos = await Appo.find({'finished': false})
            let appointments = []

            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push( AppointmentFactory.Build(appointment) )
                }
            })

            return appointments
        }

    }

    async GetById(id){
        try {
            let event = await Appo.findOne({'_id': id})
            return event
        } catch (err) {
            console.log(err)
        }
        
    }

    async Finish(id){
        try {
            await Appo.findByIdAndUpdate(id, { finished: true })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async Search(query){
        try {
            let appos = await Appo.find().or([{email: query},{cpf: query}])
            return appos
        } catch (err) {
            console.log(err)
            return []
        }
        
    }

    async sendNotification(){
        let appos = await this.GetAll(false)

        let transporter = mailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "evandromateus06@gmail.com",
                pass: "OrdnavesSuetam9908"
            },
            secure: true
        })

        appos.forEach(async app => {
            let date = app.start.getTime() // pegando a hora da consulta em milisegundos
            let hour = 1000 * 60 * 60 // pegando o valor de 1 hora em milisegundos
            let gap = date - Date.now() // calculo da data da consulta menos a data atual, para saber quanto tempo falta para a consulta

            if(gap <= hour){
                if(app.notified == false){

                    await Appo.findByIdAndUpdate(app.id, {notified: true})

                    transporter.sendMail({
                        from: "Evandro Mateus <evandromateus06@gmail.com>",
                        to: app.email,
                        subject: "Sua consulta vai acontecer em breve!",
                        text: `Sua consulta ${app.title} vai acontecer em uma hora"`
                    }).then(() => {

                    }).catch(err => {
                        console.log(err)
                    })

                }
            }
        })
    }

}

module.exports = new AppointmentService()