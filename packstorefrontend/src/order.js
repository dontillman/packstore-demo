// Copyright 2023, J. Donald Tillman, all rights reserved.
//
// Presenting an order.
// Which includes the table, handling quantities, the summary information, and the layout.

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
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

    return <OrderSectionDiv>
               {(0 < entries.length) &&
                <>
                    <OrderForm orderData={orderData}
                               onChange={onChange}/>
                    <OrderInfo orderdata={orderData} />
                    <Layout entries={entries} />
                </>
               }
           </OrderSectionDiv>;    
})

const OrderSectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: solid 1px olive;
  border-radius: 3px;
`;


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
               <OrderFormDiv>
                   <OrderFormHeading>
                       <ColQuant>
                           Quantity
                       </ColQuant>
                       <ColModel>
                           Model
                       </ColModel>
                       <ColEnergy>
                           Energy
                       </ColEnergy>
                       <ColPrice>
                           Price
                       </ColPrice>
                       <ColExt>
                           Extension
                       </ColExt>
                   </OrderFormHeading>
                   {content}
               </OrderFormDiv>
           </div>;
};

const OrderInfo = props => {
    const {orderdata} = props;

    if (orderdata.entries?.length) {
        return <div>
                   Recommended number of transformers: {orderdata.transformers}<br />
                   Total energy: {prettyEnergy(orderdata.energy)}<br />
                   Total area: {orderdata.area} ft^2<br />
                   Energy density: {orderdata.density.toFixed()} MWhrs/ft^2
                   Total price: {prettyPrice(orderdata.price)}
               </div>;
    } else {
        return <div />
    }
};

const OrderFormDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-family: helvetica;
  font-size: 12px;
`;

const OrderFormHeading = styled.div`
  display: flex;
  font-weight: bold;
  color: #666666;
  text-align: center;
  border-bottom: solid 1px gray;
  margin: 20px;
`;

const tablemargin = '0 5px';

const ColQuant = styled.div`
  width: 40px;
  margin: ${tablemargin}
`;

const ColModel = styled.div`
  width: 150px;
  margin: ${tablemargin}
`;

const ColEnergy = styled.div`
  width: 100px;
  margin: ${tablemargin}
`;

const ColPrice = styled.div`
  width: 100px;
  margin: ${tablemargin}
`;

const ColExt = styled.div`
  border: 1 px gray;
  width: 100px;
  margin: ${tablemargin}
`;
    



const OrderFormEntry = props => {
    const {entry, onChange} = props;
    const {quantity, name, size, energy, cost, extended, order} = entry;

    const handleChange = q => {
        onChange(order, name, q);
    };

    return <OrderEntryDiv>
               <InputQuantity value={quantity}
                              onChange={handleChange}/>
               <ModelSize model={name}
                          size={size} />
               <Energy energy={energy || '' } />
               <Price price={cost} />
               <Price price={extended} />
           </OrderEntryDiv>;
};

const OrderEntryDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 5px 0;
`;

// Pretty block with the model name in bold
// and the size below
const ModelSize = props => {
    const {model, size} = props;
    return <ModelSizeDiv>
               <ModelDiv>
                   {model}
               </ModelDiv>
               <SizeDiv>
                   {size[0]} ft x {size[1]} ft
               </SizeDiv>
           </ModelSizeDiv>;
};

const ModelSizeDiv = styled(ColModel)`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
`;
  
const ModelDiv = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 120%;
`;

const SizeDiv = styled.div`
  display: flex;
  font-size: 90%
`;

const Energy = props => {
    const {energy} = props;
    return <EnergyDiv>
               {prettyEnergy(energy)}
           </EnergyDiv>;
};

const EnergyDiv = styled(ColEnergy)`
  display: flex;
  text-align: right;
`;

const Price = props => {
    const {price} = props;
    return <PriceDiv>
               {prettyPrice(price)}
           </PriceDiv>;
};

const PriceDiv = styled(ColPrice)`
  display: flex;
  text-align: right;
`;

// pixels per foot
const scale = 3;

const Layout = props => {
    const {entries} = props;

    const units = entries.flatMap((entry, i) =>
        Array(entry.quantity).fill(0).map((each, j) =>
            <LayoutUnitDiv style={{width: scale * entry.size[0],
                                   height: scale * entry.size[1]}}
                           key={`${i}-${j}`}>
            </LayoutUnitDiv>));

    return <LayoutDiv>
               <p>
                   Layout:
               </p>
               <LayoutFrame>
                   {units}
               </LayoutFrame>
           </LayoutDiv>;
};

const LayoutDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const LayoutFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  margin: 10px;
  border: solid 3px olive;
  width: ${100 * scale}px;
`;
const LayoutUnitDiv = styled.div`
  display: flex;
  background-color: lightgray;
  border: solid 1px darkgray;
  border-radius: 2px;
  margin: 2px;
`;

export {OrderSection};
