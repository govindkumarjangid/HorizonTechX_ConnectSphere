class ApiResponse {
  constructor(statusCode, message = 'Success', data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  // statusCode goes in the HTTP status, not in the body
  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

export default ApiResponse;