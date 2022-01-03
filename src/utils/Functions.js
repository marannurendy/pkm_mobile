async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    clearTimeout(id);
    return response;
}

function fetchWithTimeoutWrapper(resource, options = {}) {
    const { timeout = 8000 } = options;

    const FETCH_TIMEOUT = timeout;
    let didTimeOut = false;

    return new Promise(function(resolve, reject) {
        const timeout = setTimeout(function() {
            didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

        fetch(resource, {
            ...options
        })
        .then(function(response) {
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            if (!didTimeOut) {
                console.log('fetch good! ', response);
                resolve(response);
            }
        })
        .catch(function(err) {
            console.log('fetch failed! ', err);

            // Rejection already happened with setTimeout
            if (didTimeOut) return;
            // Reject with error
            reject(err);
        });
    })
    .then(function() {
        // Request success and no timeout
        console.log('good promise, no timeout! ');
    })
    .catch(function(err) {
        // Error: response error, request timeout or runtime error
        console.log('promise error! ', err);
        reject(err);
    });
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
    replaceSpecialChar,
    fetchWithTimeoutWrapper
}
