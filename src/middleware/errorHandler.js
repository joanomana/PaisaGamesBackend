export default function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status =
        err.message?.toLowerCase().includes('stock') ? 400 :
        err.name === 'ValidationError' ? 400 :
        500;

    res.status(status).json({
        error: err.message || 'Error interno',
    });
}
