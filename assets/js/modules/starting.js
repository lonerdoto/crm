"use strict";


import { popup } from "../script.js";
import { setStorage, clearStorage } from "../modules/localStorage.js"
import { createItemRow } from "./addEl.js";
import { getData, createGoods, deleteGoods, editGoods, getGoods } from "../modules/getServerData.js";
import { lastPageItems, renderItems } from "../modules/render.js";
import { filter } from "./filter.js";
const itemList = document.querySelector(".tbody");

const data = await getData();

const popupControl = (addProductBtn, closeBtn, popup) => {
	const name = document.querySelector(".textarea-name");
	const category = document.querySelector(".textarea-category");
	const units = document.querySelector(".textarea-units");
	const discount = document.querySelector(".textarea-discount");
	const description = document.querySelector(".textarea-description");
	const count = document.querySelector(".textarea-amount");
	const price = document.querySelector(".textarea-price");
	const footerSum = document.querySelector(".footer-sum");
	const checkbox = document.querySelector(".checkbox");
	const previewImg = document.querySelector('.preview-img');
	const imgError = document.querySelector('.img_error');
	const addImgBtn = document.querySelector('.add-img');

	addProductBtn.addEventListener('click', e => {
		const imgBtn = document.querySelectorAll('.imageIcon')
		const url = 'https://playful-ubiquitous-sloth.glitch.me/';
		const nameInput = document.querySelector('.name-input')
		const categoryInput = document.querySelector('.category-input')
		const unitsInput = document.querySelector('.units-input')
		const discountInput = document.querySelector('.discount-input')
		const right = document.querySelector('.right')
		const footer__sum = document.querySelector('.footer__sum')
		const preview_img = document.querySelector('.preview-img')
		nameInput.style.display = 'block';
		categoryInput.style.display = 'block';
		unitsInput.style.display = 'block';
		discountInput.style.display = 'block';
		right.style.display = 'block';
		footer__sum.style.display = 'block';
		preview_img.style.width = '100px'
		popup.classList.add("active");
		e.stopPropagation();
	});
	closeBtn.addEventListener('click', () => {
		name.value = "";
		category.value = "";
		units.value = "";
		discount.value = "";
		description.value = "";
		count.value = "";
		price.value = "";
		footerSum.value = "";
		previewImg.src = "";
		previewImg.style.display = 'none';
		imgError.style.display = "none";
		addImgBtn.value = '';
		checkbox.checked = false;

		popupClose();
	});
	document.onclick = function (e) {
		if (!e.target.closest(".pop-up")) {
			name.value = "";
			category.value = "";
			units.value = "";
			discount.value = "";
			description.value = "";
			count.value = "";
			price.value = "";
			previewImg.src = "";
			previewImg.style.display = 'none';
			footerSum.value = "";
			checkbox.checked = false;
			popupClose();
		};
	};
};

const popupClose = () => {
	const popup = document.querySelector(".pop-up")
	popup.classList.remove("active");
	popup.querySelector(".pop-up__title").innerHTML = "Добавить товар";
	popup.querySelector('.footer__btn').innerHTML = "Добавить товар";
};

const increment = () => {
	return data.length + 1;
};

const formControl = (form, data) => {
	const form_name = document.querySelector('.pop-up__title');
	const name = document.querySelector(".textarea-name");
	const discount = document.querySelector(".textarea-discount");
	const count = document.querySelector(".textarea-amount");
	const price = document.querySelector(".textarea-price");
	const footerSum = document.querySelector(".footer-sum");
	const checkbox = document.querySelector(".checkbox");
	const addImgBtn = document.querySelector('.add-img');
	const previewImg = document.querySelector('.preview-img');
	const imgError = document.querySelector('.img_error');
	const formMsg = document.querySelector('.pop-up__header-msg');

	let itemAdd = false;

	if (checkbox.checked == true) {
		discount.removeAttribute("disabled")
		discount.setAttribute("required", '');
	}
	checkbox.addEventListener("change", () => {
		if (checkbox.checked == true) {
			footerSum.innerHTML = (Number(+(price.value)) - (Number(discount.value) * (1 / 100) * Number(price.value))) * Number(+(count.value));
			discount.removeAttribute("disabled")
			discount.setAttribute("required", '');
		} else {
			footerSum.innerHTML = count.value * price.value;
			discount.setAttribute("disabled", true)
		};
	});





	addImgBtn.addEventListener('change', async (event) => {
		let file = addImgBtn.files
		if (file.length > 0) {
			file = file[0];
		}
		console.log('yes');
		await loadPreviewImg(file);
	});


	function isNumeric(str) {
		if (typeof str != "string") return false;
		return !isNaN(str) && !isNaN(parseFloat(str));
	};





	listImgBtns();

	discount.addEventListener("input", () => {
		footerSum.innerHTML = (+(Number(price.value)) - (Number(discount.value) * (1 / 100) * Number(price.value))) * +(Number(count.value));
	})

	count.addEventListener("input", () => {
		if (document.querySelector(".checkbox").checked) {
			footerSum.innerHTML = ((Number(price.value)) - (Number(discount.value) * (1 / 100) * Number(price.value))) * +(Number(count.value));
		} else {
			footerSum.innerHTML = count.value * price.value;
		};
	});
	price.addEventListener("input", () => {
		if (document.querySelector(".checkbox").checked) {
			footerSum.innerHTML = (+(Number(price.value)) - (Number(discount.value) * (1 / 100) * Number(price.value))) * +(Number(count.value));
		} else {
			footerSum.innerHTML = Number(count.value) * Number(price.value);
		};
	});

	form.addEventListener("submit", async e => {

		e.preventDefault();
		if (itemAdd) {
			return;
		}

		if (form_name.innerHTML == "Редактирование товара") {
			return;
		}

		const formData = new FormData(e.target);


		const newItem = Object.fromEntries(formData);
		if (document.querySelector(".checkbox").checked) {
			newItem.hasDiscount = true;

		} else {
			newItem.hasDiscount = false;
		};
		if (newItem.price == '' || (newItem.discount == '' && newItem.hasDiscount) || newItem.name == '' || newItem.category == '' || parseInt(newItem.discount) > 99) {
			formMsg.innerHTML = '<p class="error__text">Ошибка. Проверьте правильность заполнения полей</p>';
			setTimeout(() => {
				formMsg.innerHTML = '';
			}, 3000);
			return;
		}
		const discount = document.querySelector(".textarea-discount");
		const addImg = document.querySelector(".add-img")
		let file = addImg.files[0]
		newItem.id = increment();

		if (previewImg) {
			newItem.haveImg = true;
		} else {
			newItem.haveImg = false;
		}


		if (newItem.hasDiscount == true) {
			newItem.total = Number(+(newItem.price) - (Number(discount.value) * (1 / 100) * newItem.price)) * + (newItem.amount);
			newItem.price = (+(newItem.price) - (discount.value * (1 / 100) * newItem.price));
		} else {
			newItem.total = +(newItem.amount) * +(newItem.price);
		};
		let itemJson = { 'title': newItem.name, 'description': newItem.description, 'category': newItem.category, 'price': newItem.price, 'units': newItem.units, 'count': newItem.amount, 'discount': newItem.discount = 0 };
		if (newItem.haveImg) {
			itemJson.image = previewImg.src;
		}
		console.log(itemJson);
		formMsg.innerHTML = '<p class="success__text">Товар добавлен</p>';
		itemAdd = true;
		setTimeout(async () => {
			formMsg.innerHTML = '';
			createGoods(JSON.stringify(itemJson));
			e.target.reset();
			popupClose();
			await renderItems();
			await lastPageItems();
			calculateTotal();
			itemAdd = false;
			listImgBtns();
		}, 3000);

	});
};

const listImgBtns = async () => {
	const imgBtn = document.querySelectorAll('.imageIcon')
	const url = 'https://playful-ubiquitous-sloth.glitch.me/';
	const nameInput = document.querySelector('.name-input')
	const categoryInput = document.querySelector('.category-input')
	const unitsInput = document.querySelector('.units-input')
	const discountInput = document.querySelector('.discount-input')
	const right = document.querySelector('.right')
	const footer__sum = document.querySelector('.footer__sum')
	const preview_img = document.querySelector('.preview-img')
	const form_name = document.querySelector('.pop-up__title');


	imgBtn.forEach(e => {
		e.addEventListener('click', async e => {
			const target = e.target;
			let item = await getGoods(target.closest(".item").querySelector('.id').innerHTML);
			e.preventDefault();
			e.stopPropagation();
			nameInput.style.display = 'none';
			categoryInput.style.display = 'none';
			unitsInput.style.display = 'none';
			discountInput.style.display = 'none';
			right.style.display = 'none';
			form_name.innerText = 'Просмотр изображения';
			footer__sum.style.display = 'none';
			preview_img.style.width = '300px'
			popup.classList.add("active");
			if (item.image.length > 50) {
				await loadPreviewImg(item.image, false);
			} else {
				await loadPreviewImg(item.image, false, false);
			}
		})
	});
}



const calculateTotal = () => {
	let sum = document.querySelector(".sum");
	let value = 0;

	data.forEach(item => {
		value += Number(+(item.price) - (Number(item.discount) * (1 / 100) * Number(item.price))) * + Number(item.count);
	});
	sum.innerHTML = value;
	return value;
}

const addItem = (item, itemList) => {
	itemList.append(createItemRow(item));
};

const deleteFunction = () => {
	const deleteIcons = document.querySelectorAll(".deleteIcon");
	deleteIcons.forEach(icon => {
		icon.addEventListener("click", async (e) => {

			e.preventDefault();
			e.stopPropagation();
			const target = e.target;
			await deleteGoods(target.parentNode.parentNode.querySelector('.id').innerHTML);
			await renderItems();
		});
	});
	listImgBtns();
};


const getImageFromServer = async (path) => {

	const data = await fetch(url + path, {
		method: 'GET',
		mode: 'no-cors',
	});

}

const editItemsFunction = () => {
	const previewImg = document.querySelector('.preview-img');
	const name = document.querySelector(".textarea-name");
	const category = document.querySelector(".textarea-category");
	const units = document.querySelector(".textarea-units");
	const discount = document.querySelector(".textarea-discount");
	const description = document.querySelector(".textarea-description");
	const count = document.querySelector(".textarea-amount");
	const price = document.querySelector(".textarea-price");
	const nameInput = document.querySelector('.name-input')
	const addImg = document.querySelector(".add-img")
	const imgError = document.querySelector('.img_error');
	const url = 'https://playful-ubiquitous-sloth.glitch.me/';
	const editIcons = document.querySelectorAll(".editIcon");
	const submitBtn = document.querySelector(".footer__btn");
	const footerSum = document.querySelector(".footer-sum");
	const checkbox = document.querySelector(".checkbox");
	const imgBtn = document.querySelectorAll('.imageIcon');
	const categoryInput = document.querySelector('.category-input')
	const unitsInput = document.querySelector('.units-input')
	const discountInput = document.querySelector('.discount-input')
	const right = document.querySelector('.right')
	const footer__sum = document.querySelector('.footer__sum')
	const preview_img = document.querySelector('.preview-img')
	editIcons.forEach(icon => {
		icon.addEventListener("click", async e => {
			const target = e.target;
			let item = await getGoods(target.closest(".item").querySelector('.id').innerHTML);
			e.preventDefault();
			e.stopPropagation();
			nameInput.style.display = 'block';
			categoryInput.style.display = 'block';
			unitsInput.style.display = 'block';
			discountInput.style.display = 'block';
			right.style.display = 'block';
			footer__sum.style.display = 'block';
			preview_img.style.width = '100px'
			popup.classList.add("active");
			popup.querySelector(".pop-up__title").innerHTML = "Редактирование товара";
			popup.querySelector('.footer__btn').innerHTML = "Обновить";


			if (item.discount != 0) {
				checkbox.checked = true;
				discount.removeAttribute("disabled")
				discount.value = item.discount;
			}
			await loadPreviewImg(item.image, false)


			name.value = item.title;
			category.value = item.category;
			units.value = item.units;

			description.value = item.description;
			count.value = item.count;
			price.value = item.price;
			footerSum.innerHTML = (Number(+(item.price)) - (Number(item.discount) * (1 / 100) * Number(item.price))) * + Number(item.count);
			if (popup.classList.contains("active")) {
				submitBtn.addEventListener("click", async () => {
					if (price.value == '' || name.value == '' || category.value == '' || parseInt(discount.value) > 99) {
						formMsg.innerHTML = '<p class="error__text">Ошибка. Проверьте правильность заполнения полей</p>';
						setTimeout(() => {
							formMsg.innerHTML = '';
						}, 3000);
						return;
					}
					item.id = item.id;
					item.name = name.value;
					item.category = category.value;
					item.discount = discount.value;
					item.description = description.value;
					item.units = units.value;
					item.count = count.value;
					item.price = price.value;

					let jsonItem = { 'title': item.name, 'description': item.description, 'category': item.category, 'price': item.price, 'units': item.units, 'count': item.amount, 'discount': item.discount }
					if (previewImg) {
						jsonItem.image = previewImg.src;
					}
					await editGoods(item.id, JSON.stringify(jsonItem));
					footerSum.innerHTML = item.total;
					location.reload();
				});
			};
			calculateTotal();
		});
	});
};


const loadPreviewImg = async (image, toBase = true, isBase = true) => {
	const previewImg = document.querySelector('.preview-img');
	const imgError = document.querySelector('.img_error');
	const addImgBtn = document.querySelector('.add-img');
	imgError.style.display = 'none';


	if (image.size > 1048576) {
		previewImg.src = '';
		previewImg.style.display = 'none';
		imgError.style.display = 'block';
		return;
	}
	let imgBase64;
	if (toBase) {
		imgBase64 = await toBase64(image);
	} else {
		imgBase64 = image;
	}
	if (isBase) {
		previewImg.src = imgBase64;
	} else {
		previewImg.src = "assets/img/noimg.png"
		console.log(123);
	}
	previewImg.style.display = 'block';
	addImgBtn.value = '';
	console.log(previewImg);

}

const toBase64 = file => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.addEventListener('loadend', () => {
		resolve(reader.result);
	});

	reader.addEventListener('error', err => {
		reject(err);
	});

	reader.readAsDataURL(file);

});


const changeToNumber = e => {
	const value = e.value;
	e.value = value.replace(/\D/g, '');
};
const removeSpace = e => {
	if (e.value.charAt(0) == ' ') {
		e.value = "";
	}
}


export { popupControl, popupClose, calculateTotal, increment, formControl, addItem, deleteFunction, editItemsFunction, removeSpace, changeToNumber, listImgBtns }
