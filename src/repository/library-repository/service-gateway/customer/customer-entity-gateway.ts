import { Customer } from 'src/constants/dto/customer/sql-customer';

export default interface CustomerEntityGateway {
  getCustomerById(id: string): Promise<any>;
  createCustomer(customer: Customer): Promise<any>;
}
