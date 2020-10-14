// messages/configSuccess.js

// Aggiunge il messaggio di successo alla pagina
function configSuccess (page, message, res) {
    const target = res.locals.success || {};
    res.locals.error = {};
    Object.assign(target,
        {
            [page]: {
                msg: message,
                isSuccessValid: true
            }
        });
    res.locals.success = target;
    res.status(200).render(page);
}

module.exports = configSuccess;