// middleware/isLoggedStudent.js

const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const StudentToken = require('../models/studentToken');
const errorRedirect = require('./errorRedirect');

// Verifica se lo studente è loggato
// in caso affermativo rinnova il roken
// altrimenti rimanda alla pagina di login
async function isLoggedStudent (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const studentToken = await StudentToken.findOne({ idStudente: data._id, token: token});
    if(studentToken) {
        const student = await Student.findOne({_id: studentToken.idStudente});
        if(student){
            const result = await student.logOut(token);
            if (result) {
                student.generateAuthToken()
                    .then((tok) => {
                        req.app.locals.token = tok;
                        return next();
                    })
                    .catch(error => {
                        errorRedirect('login',error, req, res);
                    })
            }
            return next();
        }else {
            errorRedirect('login','Utente non esiste', req, res);
        }
    }else {
        errorRedirect('login','Sessione scaduta. Per accedere devi eseguire il login', req, res);
    }
}


module.exports = isLoggedStudent;