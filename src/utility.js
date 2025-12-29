import logger from './utils/logger.js'

export function formatterForDatetime(dt) {
    const date = new Date(dt);
    const formattedDate = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
    }).format(date);

    return formattedDate
}


export function getRandomString() {
    const array = new Uint32Array(1)
    self.crypto.getRandomValues(array)
    logger.debug(`getRandomString() randomvalue: ${array[0]} ${typeof(array[0])}`)
    return array[0]
}

