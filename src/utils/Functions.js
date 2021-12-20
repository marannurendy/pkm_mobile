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

const inputVal = (v, maxV, setValue) =>{
    var tl = parseInt(v);
    if(tl > maxV) return alert(`Maaf, Anda telah mencapai batas input maksimum ${maxV}.`);
    return setValue(v);
}

export { fetchWithTimeout, inputVal }