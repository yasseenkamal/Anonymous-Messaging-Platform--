import CryptoJS from "crypto-js"


export const generateEncryption = ({ plaintext = "", signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {
    
    if(!plaintext || !signature){
        throw new Error(`Invalid encryption parameters: plaintext or signature is missing. plaintext: ${plaintext}, signature: ${signature}`);

    }

    const encryption = CryptoJS.AES.encrypt(plaintext, signature).toString()
    
    return encryption


}


export const generateDecryption = ({ cipherText = "", signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {

    const decoded = CryptoJS.AES.decrypt(cipherText, signature).toString(CryptoJS.enc.Utf8)
    return decoded

}