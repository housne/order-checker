import { FC, useState } from "react";
import { Order } from "../types/order";
import { Field, Textarea, Button } from "@fluentui/react-components";
import { Message } from "../types/message";

type Props = {
  setOrders: (orders?: Order[]) => void
  setMessage: (message: Message) => void
  clearMessage: () => void
}

export const InputComponent: FC<Props> = ({ setOrders, setMessage, clearMessage }) => {

  const [value, setValue] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clearMessage()
    setValue(e.target.value)
  }

  const handleParse = () => {
    try {
      const orders = parseOrders(value)
      if (value && orders.length === 0) {
        setMessage({
          type: "error",
          content: "无效的输入"
        })
        return
      }
      setOrders([...orders])
    } catch (e) {
      console.error(e)
      setMessage({
        type: "error",
        content: "无效的输入"
      })
    }
  }

  

  return (
    <div className="space-y-2">
      <Field label="订单列表">
        <Textarea rows={8} value={value} onChange={handleChange} />
      </Field>
      <Button onClick={handleParse} appearance='primary'>解析</Button>
    </div>
  )
}

function parseOrders(value: string): Order[] {
  return value.split("\n").reduce<Order[]>((orders, line) => {
    const list = line.split(/\s+/).filter(Boolean)
    if (list.length === 3 && list[0].startsWith("PONX")) {
      return [...orders, {
        id: list[0],
        items: [{
          sku: list[1],
          count: parseInt(list[2])
        }]
      }]
    } else if (list.length === 2) {
      orders[orders.length - 1].items.push({
        sku: list[0],
        count: parseInt(list[1])
      })
    }
    return orders
  }, [])
}