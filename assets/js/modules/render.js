"use strict";


import { getData } from "../modules/getServerData.js";
import { deleteFunction, editItemsFunction, listImgBtns } from "./starting.js";
import { createItemRow } from "./addEl.js";


const preloader = document.querySelector('.preloader')
const lol = document.querySelector('.page-number-text')

let data = await getData();
let itemsPage = 1;
let itemsView = 10;
let leftButton = document.querySelector('.left-btn');
let rightButton = document.querySelector('.right-btn');
const itemList = document.querySelector(".tbody");
const itemsViewSel = document.getElementById("items_view");
const removeItems = (elem) => {
	const items = document.querySelectorAll(elem);
	for (let i = 0; i < items.length; i++) {
		items[i].remove();
	}
}

const renderItems = async (data=null) => {
	
	if (!data) {

		data = await getData();
	}



	itemsViewSel.onchange = async (ev) => {
        itemsView = parseInt(ev.target.options[ev.target.selectedIndex].text);
		itemsPage = 1;
		await renderItems();
    }

	lol.innerHTML = `${itemsPage * itemsView - itemsView + 1} - ${itemsPage * itemsView < data.length ? itemsPage * itemsView: data.length} из ${data.length}`

	removeItems('tbody .item');
	rightButton.onclick = async () => {

		let data = await getData();
		if ((itemsPage + 1) * itemsView - itemsView > data.length) {
			return;
		}
		removeItems('tbody .item');

		itemsPage += 1;
		for (let i = itemsPage * itemsView - itemsView; i < itemsPage * itemsView && data.length > i; i++) {
			itemList.append(createItemRow(data[i]));
		}
		lol.innerHTML = `${itemsPage * itemsView - itemsView + 1} - ${itemsPage * itemsView < data.length ? itemsPage * itemsView: data.length} из ${data.length}`
		deleteFunction();
		editItemsFunction();
		listImgBtns();
	};
	
	leftButton.onclick = async () => {

		let data = await getData();
		if (itemsPage - 1 <= 0) {
			return;
		}
		removeItems('tbody .item');
		itemsPage -= 1;
		for (let i = itemsPage * itemsView - itemsView; i < itemsPage * itemsView && data.length > i; i++) {
			
			itemList.append(createItemRow(data[i]));
		}
		lol.innerHTML = `${itemsPage * itemsView - itemsView + 1} - ${itemsPage * itemsView < data.length ? itemsPage * itemsView: data.length} из ${data.length}`
		deleteFunction();
		editItemsFunction();
		listImgBtns();
	};

	for (let i = 0; i < itemsView; i++) {
		if (data[itemsPage * itemsView]) {
			itemList.append(createItemRow(data[i]));
		} else {
			if (data[itemsView + i]) {
				itemList.append(createItemRow(data[itemsView + i]));
			} else {
				data.forEach(el => {
					itemList.append(createItemRow(el));
				});
				break;
			}
		}
	}
	deleteFunction();
	editItemsFunction();
	preloader.style.display = "none"
};

const lastPageItems = async () => {
	data = getData();
	removeItems('tbody .item');
	itemsPage = data.length / itemsView % 1 === 0 ? parseInt(data.length / itemsView): parseInt(data.length / itemsView) + 1;
	for (let i = itemsPage * itemsView - itemsView - 1; i < itemsPage * itemsView && data.length > i; i++) {
		lol.innerHTML = `${itemsPage * itemsView - itemsView + 1} - ${itemsPage * itemsView < data.length ? itemsPage * itemsView: data.length} из ${data.length}`
		itemList.append(createItemRow(data[i]));
		console.log(data[i]);
	};
	deleteFunction();
	editItemsFunction();

}
export {renderItems, lastPageItems};

