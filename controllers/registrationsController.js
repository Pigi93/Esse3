// controllers/registrationsController.js

const Registration = require('../models/registration');
const configError = require('../messages/configError');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina con le iscrizioni effettuate
async function registrationsGET (req, res) {
    try{
        const matricola = req.app.locals.matricola;
        const registrations = await Registration.find({studente: matricola}).sort({data: 'descending'});
        req.app.locals.myRegistrations = registrations;
        res.render('registrations');
    }catch (error){
        console.log(error);
    }
}

// Annulla le iscrizioni
async function registrationsPOST (req, res) {
    try{
        const dati = req.body;
        const id = dati.id;
        const registration = await Registration.findOne({_id:id});
        if(registration){
            const date = new Date();
            if(registration.data.getTime() > date.getTime()) {
                await Registration.deleteRegistration(id);
                successRedirect('registrations', 'Iscrizione annullata', req, res);
            }else{
                configError('registrations', 'Non è possibile annullare iscrizioni passate', res);
            }
        }else{
            configError('registrations', 'La prenotazione non esiste', res);
        }
    }catch (error){
        console.log(error);
    }
}

module.exports = {
    registrationsGET,
    registrationsPOST
};