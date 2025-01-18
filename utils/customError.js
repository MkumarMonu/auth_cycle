class customError extends Error{
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode;
    this.name = message;
  }
}

module.exports=customError;