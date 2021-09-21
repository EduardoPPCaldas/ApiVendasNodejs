import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { Customer } from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IRequest {
  id: string
}

export class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<Customer>{
    const customersRespository = getCustomRepository(CustomersRepository)
    const customer = await customersRespository.findById(id)

    if(!customer){
      throw new AppError("Customer not found")
    }

    return customer
  }
}