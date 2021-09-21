import { getCustomRepository } from "typeorm";
import AppError from "@shared/errors/AppError";
import { CustomersRepository } from "../typeorm/repositories/CustomersRepository";

interface IRequest {
  id: string
}

export class DeleteCustomerService {
  public async execute({id}: IRequest): Promise<void>{
    const customersRespository = getCustomRepository(CustomersRepository)
    const customer = await customersRespository.findOne(id)

    if(!customer){
      throw new AppError("Customer not found")
    }

    await customersRespository.remove(customer)
  }
}