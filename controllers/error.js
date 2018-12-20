exports.get404 = (req, res, next) => {
    res.setStatus(404).send('<h1>File Not Found</h1>');
};