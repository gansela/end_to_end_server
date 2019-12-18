const usersPool = require("./usersPool")
const bcrypt = require('bcryptjs');

function getUsersQuery() {
    return `select * from users_table where email = ?;`
}

function getInsertQuery() {
    return "INSERT INTO `users`.`users_table` ( `email`, `password`) VALUES ( ?, ?);"
}

function getCreatePasswordsQuery() {
    return "INSERT INTO `users`.`old_passwords` ( `user_id`, `password1`) VALUES ( ?, ?);"
}

function getChangePasswordsQuery() {
    return "UPDATE `users`.`users_table` SET `password` = ? WHERE (`id` = ?) and (email = ?) ;"
}

function getOldPasswordsQuery() {
    return "SELECT * FROM users.old_passwords WHERE user_id = ?;"
}

function isUpdatePasswords() {
    return "UPDATE `users`.`old_passwords` SET `password1` = ?, `password2` = ?, `password3` = ?, `password4` = ?, `password5` = ? WHERE (`user_id` = ?);"
}

async function isUserExist(params) {
    const { email, password } = params
    const result = await usersPool.execute(getUsersQuery(), [email]);
    const [first] = result;
    const [user] = first
    console.log(user)
    return user

}

async function isInsertExist(body) {
    const { email, password } = body
    const result = await usersPool.execute(getInsertQuery(), [email, password]);
    const [first] = result;
    const { insertId } = first
    if (insertId) insertCreatePasswords({ user_id: insertId, password })
    return insertId

}

async function insertCreatePasswords(body) {
    const { user_id, password } = body
    const result = await usersPool.execute(getCreatePasswordsQuery(), [user_id, password]);
    const [first] = result;
    const { insertId } = first
    return insertId
}

async function isChangePassword(body) {
    const { newPassword, id, email, passArray } = body
    const result = await usersPool.execute(getChangePasswordsQuery(), [newPassword, id, email]);
    const [first] = result;
    const { affectedRows } = first
    console.log(...passArray, id)
    if (affectedRows) usersPool.execute(isUpdatePasswords(),[...passArray, id]);
    return affectedRows
}

async function isCheckPasswords(body) {
    const { id, newPassword } = body
    const result = await usersPool.execute(getOldPasswordsQuery(), [id]);
    const [first] = result;
    const [passwordsObj] = first
    const passwordsArray = isPasswordExist(passwordsObj, newPassword)
    return passwordsArray
}
function isPasswordExist(obj, newPassword) {
    const { password1, password2, password3, password4, password5 } = obj
    const passwordsArray = [password1, password2, password3, password4, password5]
    const findPassword = passwordsArray.find((pass) => {
        const result = (bcrypt.compareSync(newPassword, pass || ""))
        return (result === true)
    })
    if (findPassword) return null
    return passwordsArray
}

module.exports = { isInsertExist, isUserExist, getInsertQuery, getUsersQuery, isChangePassword, isCheckPasswords }