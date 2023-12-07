"use strict";


import { getData } from "./modules/getServerData.js";
import {getStorage} from "./modules/localStorage.js";
import {renderItems} from "../js/modules/render.js";
import {popupControl, formControl, deleteFunction, editItemsFunction} from "./modules/starting.js";
import {filter} from "../js/modules/filter.js";

let addProductBtn = document.querySelector(".add-product-btn");
let popup = document.querySelector(".pop-up");
let closeBtn = document.querySelector(".pop-up__close");
const form = document.querySelector(".pop-up__main");
const data = await getData();


const init = async () => {
	popupControl(addProductBtn, closeBtn, popup);
	await renderItems();
	formControl(form, data);
	filter();
}

init();

export {data, popup}










