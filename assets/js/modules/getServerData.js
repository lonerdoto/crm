'use strict'

const getData = async() => {
    const data = await fetch(`https://jungle-ruby-silence.glitch.me//api/goods`);
    return data.json()
}


const getGoods = async (id) => {
    const data = await fetch(`https://jungle-ruby-silence.glitch.me//api/goods/${id}`);
    return data.json()
}


const createGoods = async (data) => {
    const res = await fetch(`https://jungle-ruby-silence.glitch.me//api/goods`, {
        method: 'POST',
        body: data
    });

    let result = await res.json();

}


const deleteGoods = async (id) => {
    const res = await fetch(`https://jungle-ruby-silence.glitch.me//api/goods/${id}`, {
        method: 'DELETE'
    })

    let result = await res.json();

}


const editGoods = async (id, data) => {
    const res = await fetch(`https://jungle-ruby-silence.glitch.me/api/goods/${id}`, {
        method: "PATCH",
        body: data
    })

    const result = await res.json();

}

export { getData, createGoods, deleteGoods, editGoods, getGoods }
