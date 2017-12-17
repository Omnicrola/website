let Ajax = (() => {
    function _get(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return;
            callback(this.responseText);
        };
        xhr.send();
    }

    return {
        get: _get
    };
})();
