export const Ajax = (() => {

    function _get(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        let promise = new Promise((resolve, reject) => {
            xhr.onreadystatechange = function () {
                if (this.readyState !== 4) return;
                if (this.status == 200) {
                    console.log('loaded : ' + url);
                    resolve(this.responseText);
                } else { 
                    console.log('Failed to retrieve URL : ' + url);
                    reject(this);
                }
            };
        });

        xhr.send();
        return promise;
    }

    return {
        get: _get
    };
})();
