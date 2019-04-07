const mapi = require('./mapi')

function mapRoutes (app) {
    app.use(mapi.routes());
}

module.exports = mapRoutes