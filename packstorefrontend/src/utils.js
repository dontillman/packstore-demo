// Copyright 2023, J. Donald Tillman, all rights reserved.

import styles from './styles-utils.css';
import React, { useState } from 'react';


// Perform a local JSON post, handle the csrf tokan.
const jsonPost = (url, data) => {
    const options = {method: 'POST',
                     headers: {'X-CSRFToken': getCookie('csrftoken')},
                     mode: 'same-origin'};
    if (data) {
        options.body = JSON.stringify(data);
    }
    return fetch(url, options)
        .then(resp => resp.json());
};

const getCookie = key => {
    const found = document.cookie
          .split(';')
          .find(c => c.trim().split('=')[0] === key);
    return found.split('=')[1].trim() || '';
}


// Format a price in USD.
const prettyPrice = price =>
      price.toLocaleString('en-US', {style: 'currency', currency: 'USD'});


// Format energy in MWhrs.
const prettyEnergy = energy =>
      `${(energy / 1e6).toFixed(1)} MWhrs`;


// Input Quantity widget.
// Validates non-negative integers
const InputQuantity = props => {
    const {value, onChange} = props;
    const [valid, setValid] = useState(true);
    
    const handleChange = e => {
        const isValid = /^\s*(\d*)\s*$/.exec(e.target.value);
        if (isValid) {
            onChange(parseInt(isValid[1], 10));
        }
        setValid(isValid);
    };

    return <input className="quantity"
                  value = {value}
                  valid={valid}
                  onChange={handleChange}
                  style={{color: valid ? 'black' : 'red'}} />
};

export {jsonPost, prettyPrice, prettyEnergy, InputQuantity};
