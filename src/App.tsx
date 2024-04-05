import { useCallback, useState, useRef, useEffect } from 'react'
import './App.css'
import { Order } from './types/order'
import { InputComponent } from './components/Input'
import { CheckerComponent, type CheckerComponentRef } from './components/Checker';
import {
  MessageBar,
  MessageBarBody
} from "@fluentui/react-components";
import { Message } from './types/message';

function App() {
  const [orders, setOrders] = useState<Order[]>()
  const [message, setMessage] = useState<Message>()
  
  const checkRef = useRef<CheckerComponentRef>(null)

  useEffect(() => {
    if (!orders || !checkRef.current || !orders.length) {
      return
    }
    checkRef.current.focus()
  }, [orders])

  const clearMessage = useCallback(() => {
    setMessage(undefined)
  }, [])

  return (
    <div className='space-y-4'>
      {
        message && (
          <MessageBar intent={message.type}>
            <MessageBarBody>
              {message.content}
            </MessageBarBody>
          </MessageBar>
        )
      }
      <InputComponent setOrders={setOrders} setMessage={setMessage} clearMessage={clearMessage} />
      {Boolean(orders && orders.length) && <CheckerComponent orders={orders || []} setMessage={setMessage} clearMessage={clearMessage} ref={checkRef} /> }
    </div>
  )
}

export default App
