async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    if (__DEV__) console.log('functions fetchWithTimeout id:', id);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    clearTimeout(id);
    return response;
}

const inputVal = (v, maxV, setValue) =>{
    var tl = parseInt(v);
    if(tl > maxV) return alert(`Maaf, Anda telah mencapai batas input maksimum ${maxV}.`);
    return setValue(v);
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

const currency = (price, sign = '') => {
    const pieces = parseFloat(price).toFixed(2).split('');
    let ii = pieces.length - 3
    while ((ii-=3) > 0) {
        pieces.splice(ii, 0, ',')
    }
    return sign + pieces.join('')
}

const digits_only = string => [...string].every(c => '0123456789'.includes(c));

const replaceSpecialChar = (keyword) => (
    keyword.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
);

export {
    fetchWithTimeout,
    inputVal,
    capitalize,
    currency,
    digits_only,
    replaceSpecialChar
}
