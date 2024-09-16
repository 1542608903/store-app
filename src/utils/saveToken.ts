
/**
 *保存token
 * @param {string} name "accessToken"
 * @param {string} token "token"
 */
const saveToken = (name: string = 'accessToken', token: string) => {
  localStorage.setItem(name, token);
};

/**
 *读取token
 * @param {string} "accessToken"
 * @return {string} "token"
 */
const getToken = (name: string = 'accessToken'): string | undefined | null => {
  return 'Bearer ' + localStorage.getItem(name);
}

/**
*删除token
* @param {string} "accessToken/rfreshToken"
*/
const removeToken = (name: string = 'accessToken') => {
  localStorage.removeItem(name);
};

export { saveToken, getToken, removeToken };
