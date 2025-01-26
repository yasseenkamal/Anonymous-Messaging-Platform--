import bcrypt from "bcrypt"



export const generateHash = ({ plaintext = "", salt = process.env.SALT } = {}) => {

    const hash = bcrypt.hashSync(plaintext, parseInt(salt))
    return hash

}


export const comparHash = ({ plaintext = "", hashValue="" } = {}) => {

    return bcrypt.compareSync(plaintext, hashValue)
     

}