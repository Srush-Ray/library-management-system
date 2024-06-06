import RestResponse from 'src/constants/enums/configs/RestResponse';
import RestResponseBuilder from '../rest-client/rest-client';

export default class RestError extends Error {
  response: RestResponse;
  constructor(
    message: string,
    status: number,
    public code?: string,
  ) {
    super(message);
    this.response = new RestResponseBuilder().setStatus(status).build();
  }
}
export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
