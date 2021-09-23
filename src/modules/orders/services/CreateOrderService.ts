import { CustomersRepository } from "@modules/customers/typeorm/repositories/CustomersRepository";
import { ProductsRepository } from "@modules/products/typeorm/repositories/ProductsRepository";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { Order } from "../typeorm/entities/Order";
import { OrdersRepository } from "../typeorm/repositories/OrdersRepository";

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customer_id: string
  products: IProduct[]
}

export class CreateOrderService {
  public async execute({customer_id, products}: IRequest): Promise<Order>{
    const ordersRepository = getCustomRepository(OrdersRepository)

    const customerRepository = getCustomRepository(CustomersRepository)
    
    const productsRepository = getCustomRepository(ProductsRepository)

    const customerExists = await customerRepository.findById(customer_id)

    if(!customerExists){
      throw new AppError("Could not find any customer with the given ID")
    }

    const existsProducts = await productsRepository.findAllByIds(products)

    if(!existsProducts.length){
      throw new AppError("Could not find any products with the given IDs")
    }

    const existsProductsId = existsProducts.map((product) => product.id)

    const checkInexistentProducts = products.filter(
      product => !existsProductsId.includes(product.id)
    )

    if(checkInexistentProducts.length){
      throw new AppError(`Could not find ${checkInexistentProducts[0].id}`)
    }

    const quantityAvailable = products.filter(
      product => existsProducts.filter(
        p => p.id === product.id
      )[0].quantity < product.quantity,
    )

    if(quantityAvailable.length){
      throw new AppError(`The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`)
    }

    const serializedProducts = products.map(
      product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: existsProducts.filter(p => p.id === product.id)[0].price
      })
    )

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts
    })

    const { order_products } = order

    const updatedProductQuantity = order_products.map(
      product => ({
        id: product.product_id,
        quantity: existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity
      })
    )

    await productsRepository.save(updatedProductQuantity)

    return order
  }
}