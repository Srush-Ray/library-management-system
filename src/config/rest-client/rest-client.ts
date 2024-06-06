import RestResponse from 'src/constants/enums/configs/RestResponse';

export default class RestResponseBuilder {
  private data: any;
  private status: number;
  private statusText: string;
  private headers: any;
  private request?: any;

  setData(data): RestResponseBuilder {
    this.data = data;
    return this;
  }

  setStatus(status: number): RestResponseBuilder {
    this.status = status;
    return this;
  }

  setStatusText(statusText: string): RestResponseBuilder {
    this.statusText = statusText;
    return this;
  }

  setHeaders(headers): RestResponseBuilder {
    this.headers = headers;
    return this;
  }

  setRequest(request): RestResponseBuilder {
    this.request = request;
    return this;
  }

  build(): RestResponse {
    return {
      data: this.data,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      request: this.request,
    };
  }

  static buildWithResponse(response: any): RestResponse {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      request: response.config?.request,
    };
  }
}
