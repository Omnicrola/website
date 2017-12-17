let Ajax = (() => {
    function _get(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        let promise = new Promise((resolve, reject) => {
            xhr.onreadystatechange = function () {
                if (this.readyState !== 4) return;
                if (this.status !== 200) {
                    reject(this);
                }
                console.log('loaded : ' + url);
                resolve(this.responseText);
            };
        });

        xhr.send();
        return promise;
    }

    return {
        get: _get
    };
})();
