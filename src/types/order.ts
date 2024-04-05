export type OrderItem = {
  sku: string
  count: number
}

export type Order = {
  id: string
  items: OrderItem[]
}

export type CheckOrder = Omit<Order, 'items'> & {
  items: Array<OrderItem & { checked: boolean }>
}