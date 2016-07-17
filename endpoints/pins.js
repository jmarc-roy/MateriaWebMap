module.exports = (req, app) => {
    return app.entities.get('pins').model.findAll()
}