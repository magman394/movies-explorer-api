class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
function NotFoundError(message) {
  this.message = message;
  this.statusCode = 404;
}
function NotAvtorizationError(message) {
  this.message = message;
  this.statusCode = 401;
}
function BadRequestError(message) {
  this.message = message;
  this.statusCode = 400;
}
function ConflictError(message) {
  this.message = message;
  this.statusCode = 409;
}

const centralError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = {
  NotFoundError, NotAvtorizationError, BadRequestError, ForbiddenError, ConflictError, centralError,
};
