// Copyright 2023, J. Donald Tillman, all rights reserved.

import React, { useRef, useState } from 'react';
import styles from './styles-packstore.css';
import { jsonPost } from './utils';
import { OrderSection } from './order';

// Pack Store App
function App() {
    const orderFormRef = useRef();
    
    const handleOrderChange = o => {
        jsonPost('api/getorder', {order: o})
            .then(resp => orderFormRef.current.setOrderData(resp));
    };

    const handleChange = (order, model, quantity) => {
        jsonPost('api/setquantity', {order, model, quantity})
            .then(resp => orderFormRef.current.setOrderData(resp));
    };

    return <div className="packstore-app">
               <div className="title">
                   Welcome to the Pack Store
               </div>
               
               <OrderSelector onChange={handleOrderChange} />

               <OrderSection ref={orderFormRef}
                             onChange={handleChange} />
           </div>;
}

const OrderSelector = props => {
    const {onChange} = props;
    const [orders, setOrders] = useState(null);

    const handleChange = e => 
          onChange(parseInt(e.target.value));

    const handleClick = () => 
          jsonPost('api/neworder')
          .then(resp => jsonPost('api/orders'))
          .then(resp => setOrders(resp.orders));

    if (!orders) {
        jsonPost('api/orders')
            .then(resp => setOrders(resp.orders));
        return <div>
                   Initializing...
               </div>;
    }
    return <div className="order-select">
               <p>
                   Select an Order:
                   <select onChange={handleChange} >
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
           </div>;
};

export default App;
