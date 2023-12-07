"use strict"
import { getData } from "./getServerData.js"
import { renderItems } from "./render.js"

const filter = () => {
    const placeHolder = document.getElementById("input");
    const itemsView = document.getElementById("items_view");
    placeHolder.oninput = async (ev) => {
        let value = ev.target.value.trim();
        
        const data = await getData();
        let sort_data = [];
        

        if (value) {
            data.forEach(el => {
                if (el.title.search(value) != -1) {
                    sort_data.push(el);
                }
            });
            await renderItems(sort_data)
        } else {
            await renderItems(data);
        }
    }
}

export {filter}