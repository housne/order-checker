import { CheckOrder, Order } from "../types/order";

export function setupCheckOrderFromOrder(order: Order): CheckOrder {
  return {
    ...order,
    items: order.items.reduce<CheckOrder['items']>((items, item) => {
      const newItems = [...items]
      for (let i = 0; i < item.count; i++) {
        newItems.push({
          ...item,
          checked: false
        })
      }
      return newItems
    }, [])
  }
}