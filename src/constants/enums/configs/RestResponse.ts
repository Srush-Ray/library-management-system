export default interface RestResponse<D = any> {
  data: D;
  status: number;
  statusText: string;
  headers: any;
  request?: any;
}
