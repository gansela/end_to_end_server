const nwPool = require("./nwPool")

async function getOrdersData(params = null) {
    const {shipcity, paymenttype} = params
    const ship = shipcity === "all" ? "%%" : shipcity
    const payment = paymenttype === "all" ? "%%" : paymenttype
    const data = await nwPool.execute(getOrdersQuery(), [ship, payment]);
    const [first] = data;
    return first
}


//  reducing city for client dropdown

async function getOrdersHeaders(params = null) {
    const data = await nwPool.execute(geyOrdersCategories(), [params = null]);
    const [first] = data;
    const result = first.reduce((acumilator, line) => {
        const { ship_city, payment_type } = line
        const tempShip = acumilator.ship ? [...acumilator.ship] : []
        const tempPay = acumilator.payment ? {...acumilator.payment} : {}
        if (!payment_type) return { ...acumilator, ship: [...tempShip, ship_city]}
        return { ...acumilator, ship: [...tempShip, ship_city], payment: {...tempPay, [payment_type]: payment_type }}

    }, {})
    return result
}

//  dynamic name serch
async function getCostumersData(params) {
    const { firstname, lastname } = params
    const first_name = `%${firstname}%`
    const last_name = `%${lastname}%`
    const data = await nwPool.execute(getCostumersQuery(), [first_name, last_name])
    const [first] = data;
    return first
}

function getCostumersQuery() {
    return `select * from customers where (customers.first_name like ?) and (customers.last_name like ?)`
}

function getOrdersQuery() {
    return `select * from orders where ship_city like ? and payment_type like ?`
}

function geyOrdersCategories() {
    return `select ship_city, payment_type, count(*) from orders group by ship_city`
}

module.exports = { getOrdersData, getCostumersData, getOrdersHeaders }