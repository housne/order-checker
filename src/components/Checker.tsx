import { FC, ForwardRefRenderFunction, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Order, CheckOrder } from "../types/order";
import { setupCheckOrderFromOrder } from "./helpers";
import { Field, Textarea } from "@fluentui/react-components";
import { Message } from "../types/message";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Checkbox
} from "@fluentui/react-components";

type Props = {
  orders: Order[]
  setMessage: (message: Message) => void
  clearMessage: () => void
}

export type CheckerComponentRef = {
  focus: () => void
}


export const CheckerRenderComponent: ForwardRefRenderFunction<CheckerComponentRef, Props> = ({ orders, setMessage, clearMessage }, ref) => {
  const [value, setValue] = useState<string>("")
  const [checkOrder, setCheckOrder] = useState<CheckOrder>()
  const checkOrderRef = useRef(checkOrder)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus()
    }
  }), [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    checkOrderRef.current = checkOrder
  }, [checkOrder])

  useEffect(() => {
    if (!value) {
      return
    }
    const lastChar = value.at(-1)
    if (lastChar !== "\n" && lastChar !== "\r") {
      return
    }
    if (!value.startsWith("PONX")) {
      setValue("")
      setMessage({type: "error", content: "无效的输入"})
      return
    }
    const list = value.split("\n")
    if (!value || list.length === 0) {
      return
    }
    const input = list.at(-2)
    if (!input) {
      return
    }
    const checkOrder = checkOrderRef.current
    if (input.startsWith("PONX")) {
      if (checkOrder?.id !== input) {
        const order = orders.find(order => order.id === input)
        if (order) {
          clearMessage()
          setCheckOrder(setupCheckOrderFromOrder(order))
        }
      }
      return
    } 
    const sku = input
    const order = checkOrderRef.current
    if (!order) {
      return
    }
    const skuLength = list.filter(line => line === input)?.length
    const checkedSkuLength = order.items.filter(item => item.sku === sku && item.checked)?.length
    if (skuLength === checkedSkuLength) {
      return
    }
    const index = order.items.findIndex(item => item.sku === sku && !item.checked)
    if (index > -1 && !order.items[index].checked) {
      clearMessage()
      const items = [...order.items]
      items[index] = { ...items[index], checked: true }
      setCheckOrder({
        ...order,
        items
      })
    } else if (index === -1) {
      setMessage({type: "error", content: `${sku} 不属于当前 PONX`})
    }
  }, [value, setCheckOrder, orders, setMessage, clearMessage])

  return (
    <div className="space-y-6 mt-6">
      {
        checkOrder && (
          <OrderComponent order={checkOrder} />
        )
      }
      <Field label="扫码内容">
        <Textarea rows={8} value={value} onChange={handleChange} ref={textareaRef} />
      </Field>
    </div>
  )
}


const OrderComponent: FC<{ order: CheckOrder }> = ({ order }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="font-semibold">{order.id}</div>
        <div>{order.items.filter(i => i.checked).length} / {order.items.length}</div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>SKU</TableHeaderCell>
            <TableHeaderCell>图片</TableHeaderCell>
            <TableHeaderCell>已校验</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>图片</TableCell>
              <TableCell>
                <Checkbox checked={item.checked} readOnly />
                {
                  item.checked ? <span className="text-green-700 font-semibold">已校验</span> : <span>未校验</span>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const CheckerComponent = forwardRef(CheckerRenderComponent)