// Copyright 2023, J. Donald Tillman, all rights reserved.

import React, { useRef, useReducer, useState } from 'react';
import styled from 'styled-components';
import { jsonPost } from './utils';
import { OrderSection } from './order';


function App() {
    const orderFormRef = useRef();
    const [ , refresh] = useReducer((s, a) => s + 1);

    const handleOrderChange = o => {
        jsonPost('api/getorder', {order: o})
            .then(resp => orderFormRef.current.setOrderData(resp));
    };

    const handleChange = (order, model, quantity) => {
        jsonPost('api/setquantity', {order, model, quantity})
            .then(resp => orderFormRef.current.setOrderData(resp));
    };

    return <AppDiv className="App">
               <Title>
                   Welcome to the Pack Store
               </Title>
               
               <OrderSelector onChange={handleOrderChange}
                              onNewOrder={refresh} />

               <OrderSection ref={orderFormRef}
                             onChange={handleChange} />
           </AppDiv>;
}

const AppDiv = styled.div`
  width: 600px;
  padding: 20px;
  border: solid 1px olive;
  border-radius: 3px;
  margin-left: 20px;
  font-family: helvetica;
  font-size: 14px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 110%;
`;

const OrderSelector = props => {
    const {onChange, onNewOrder} = props;
    const [orders, setOrders] = useState(null);
    const selectRef = useRef();

    const handleChange = e => 
          onChange(parseInt(e.target.value));

    const handleClick = () => 
          jsonPost('api/neworder')
          .then(resp => onNewOrder(resp.order));
    

    if (!orders) {
        jsonPost('api/orders')
            .then(resp => setOrders(resp.orders));
        return <div>
                   Initializing...
               </div>;
    }
    return <OrderSelectDiv>
               <p>
                   Select an Order:
                   <select onChange={handleChange}
                           ref={selectRef} >
                       <option disabled={true}
                               selected={true} >
                           Select an order
                       </option>
                       {orders.map(o => <option value={o}
                                                key={o} >
                                            Order {o}
                                        </option>)
                       }
                   </select>
               </p>
               <p>
                   Or create a new order:
                   <button onClick={handleClick}>
                       Add order
                   </button>
               </p>
           </OrderSelectDiv>;
};

const OrderSelectDiv = styled.div`
  width: 400px;
  padding: 10px;
  border: solid 1px lightgray;
  border-radius: 3px;
  margin: 20px 0;
`;


export default App;
