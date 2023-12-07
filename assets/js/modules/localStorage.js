"use strict";


import { data } from "../script.js";
const setStorage = () => {
	let storage = localStorage.setItem('data', JSON.stringify(data))
    return storage;
};

const getStorage = () => {
    if (typeof localStorage.getItem('data') !== 'undefined' && localStorage.getItem('data') !== null) {
        for (let i = 0; i < JSON.parse(localStorage.getItem('data')).length; i++) {
            data.push(JSON.parse(localStorage.getItem('data'))[i]);
        };
        return data;
    } else {
        return data;
    };
};

const clearStorage = (target) => {
    if (JSON.parse(localStorage.getItem('data')).length != 0) {
        for (let i = 0; i < JSON.parse(localStorage.getItem('data')).length; i++) {
            if (+(data[i].id) == +(target.parentNode.parentNode.childNodes[0].textContent)) {
                data.splice(i, 1);
                setStorage();
                return data;
            }
        }
    }   

}

export {setStorage, getStorage, clearStorage}