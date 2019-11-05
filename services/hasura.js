const HasuraService = {
  /**
   * Get the Hasura HTTP auth headers for a given incoming request.
   *
   * @param {AxiosRequest} req
   */
  getHeaders(req) {
    const { headers } = req;
  }
};

module.exports = HasuraService;
