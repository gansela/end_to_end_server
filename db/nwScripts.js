const nwPool = require("./nwPool")

 async function getOrdersData(params = null) {
    const data = await nwPool.execute(getOrdersQuery(), [params = null]);
    const [first] = data;
    console.log(first)
    return first
}


function getOrdersQuery() {
    return `select * from orders `
}

module.exports = { getOrdersData }