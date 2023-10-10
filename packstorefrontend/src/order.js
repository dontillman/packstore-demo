// Copyright 2023, J. Donald Tillman, all rights reserved.
//
// Presenting an order.
// Which includes the table, handling quantities, the summary information, and the layout.

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './styles-order.css';
import { prettyEnergy, prettyPrice, InputQuantity } from './utils';

// Displays everything about the current order.
// Use setOrderData() to set it.
// onChange is for quantity changes in the order entries.
const OrderSection = forwardRef((props, ref) => {
    const {onChange} = props;
    const [orderData, setOrderData] = useState({});
    const {entries=[]} = orderData;

    useImperativeHandle(ref,
                        () => ({
                            setOrderData
                        }),
                        []);

    return <div className="order-section">
               {(0 < entries.length) &&
                <>
                    <OrderForm orderData={orderData}
                               onChange={onChange}/>
                    <OrderInfo orderdata={orderData} />
                    <Layout entries={entries} />
                </>
               }
           </div>;
})

const OrderForm = props => {
    const {orderData, onChange} = props;
    const {entries=[]} = orderData;

    var content = <i>Select an order</i>;
    if (entries.length) {
        content = entries.map((e, i) =>
            <OrderFormEntry entry={e}
                            onChange={onChange}
                            key={i} />);
    }
    return <div>
               <div className="order-form">
                   <div className="order-form-heading">
                       <div className="col-quant">
                           Quantity
                       </div>
                       <div className="col-model">
                           Model
                       </div>
                       <div className="col-energy">
                           Energy
                       </div>
                       <div className="col-price">
                           Price
                       </div>
                       <div className="col-price">
                           Extension
                       </div>
                   </div>
                   {content}
               </div>
           </div>;
};

const OrderInfo = props => {
    const {orderdata} = props;

    if (orderdata.entries?.length) {
        return <div>
                   Recommended number of transformers: {orderdata.transformers}<br />
                   Total energy: {prettyEnergy(orderdata.energy)}<br />
                   Total area: {orderdata.area} ft^2<br />
                   Energy density: {orderdata.density.toFixed()} MWhrs/ft^2<br />
                   Total price: {prettyPrice(orderdata.price)}
               </div>;
    } else {
        return <div />
    }
};

const OrderFormEntry = props => {
    const {entry, onChange} = props;
    const {quantity, name, size, energy, cost, extended, order} = entry;

    const handleChange = q => {
        onChange(order, name, q);
    };

    return <div className="order-entry">
               <InputQuantity value={quantity}
                              onChange={handleChange}/>
               <div className="model-size">
                   <div className="model">
                       {name}
                   </div>
                   <div className="size">
                       {size[0]} ft x {size[1]} ft
                   </div>
               </div>
               <div className="energy">
                   {(energy) ? prettyEnergy(energy) : ''}
               </div>
               <div className="price">
                   {prettyPrice(cost)}
               </div>
               <div className="price">
                   {prettyPrice(extended)}
               </div>
           </div>;
};

// pixels per foot
const scale = 3;

const Layout = props => {
    const {entries} = props;

    const units = entries.flatMap((entry, i) =>
        Array(entry.quantity).fill(0).map((each, j) =>
            <div class="layout-unit"
                 style={{width: scale * entry.size[0],
                         height: scale * entry.size[1]}}
                 key={`${i}-${j}`}>
            </div>));

    return <div className="layout">
               <p>
                   Layout:
               </p>
               <div className="layout-frame"
                    style={{width: 100 * scale}}>
                   {units}
               </div>
           </div>;
};

export {OrderSection};
