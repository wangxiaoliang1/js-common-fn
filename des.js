import cryptoJs from "crypto-js";

/**
 * @description des加密
 * @param message 要加密
 * @param key 加密关键字
 * @param iv 加密关键字
 * @return {String} 加密过后的字符串
 */
export const encryptDes = (message, key, iv) => {
  let keyHex = cryptoJs.enc.Utf8.parse(key)
  let ivHex = cryptoJs.enc.Utf8.parse(iv)
  let option = { iv: ivHex, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 }
  let encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
  return encrypted.ciphertext.toString()
}

/**
 * @description des解密
 * @param message 要解密
 * @param key 解密关键字
 * @param iv 解密关键字
 * @return {String} 解密过后的字符串
 */
export const decryptDes = (message, key, iv) => {
  let keyHex = cryptoJs.enc.Utf8.parse(key)
  let ivHex = cryptoJs.enc.Utf8.parse(iv)
  let decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Hex.parse(message)
    },
    keyHex,
    {
      iv: ivHex,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    }
  )
  return decrypted.toString(cryptoJs.enc.Utf8)
}

/**
 * @description 十六进制字符串转为base64
 * @param str 要转换的字符串
 * @return {String} 转换过后的base64字符串
 */
export const stringToBase64 = str => {
  let digits="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64_rep = "";
  let bit_arr = 0;
  let bit_num = 0;
  let ascv = null;
  for(let n = 0; n < str.length; ++n) {
    if(str[n] >= 'A' && str[n] <= 'Z') {
      ascv = str.charCodeAt(n) - 55;
    } else if(str[n] >= 'a' && str[n] <= 'z') {
      ascv = str.charCodeAt(n) - 87;
    } else {
      ascv = str.charCodeAt(n) - 48;
    }
    bit_arr = (bit_arr << 4) | ascv;
    bit_num += 4;
    if(bit_num >= 6) {
      bit_num -= 6;
      base64_rep += digits[bit_arr >>> bit_num];
      bit_arr &= ~(-1 << bit_num);
    }
  }
  if(bit_num > 0) {
    bit_arr <<= 6 - bit_num;
    base64_rep += digits[bit_arr];
  }
  let padding = base64_rep.length % 4;
  if(padding > 0) {
    for(let n = 0; n < 4 - padding; ++n) {
      base64_rep += "=";
    }
  }
  return base64_rep;
}
