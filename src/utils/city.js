const TOKEN_NAME = 'houserent_city'
const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME))

const setCity = (value) => JSON.parse(localStorage.setItem(TOKEN_NAME, value))

export { getCity, setCity }
