const _css = `
#lightbox-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.88);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}
#lightbox-overlay.open {
    display: flex;
}
#lightbox-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 92vw;
    max-height: 92vh;
    border: 3px solid rgba(255, 255, 255, 0.25);
    background: rgba(0, 0, 0, 0.6);
    padding: 12px;
    box-sizing: border-box;
}
#lightbox-images {
    position: relative;
    width: 85vw;
    height: 80vh;
}
#lightbox-images img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 0;
    visibility: hidden;
}
#lightbox-images img.lightbox-active {
    z-index: 1;
    visibility: visible;
}
#lightbox-images #lightbox-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    visibility: visible;
    height: 20%;
    min-height: 64px;
}
#lightbox-caption {
    color: #ccc;
    font-size: 13px;
    text-align: center;
    padding: 8px 4px 0;
    min-height: 1.6em;
    width: 100%;
}
#lightbox-close {
    position: absolute;
    top: -18px;
    right: -18px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
#lightbox-prev,
#lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    font-size: 36px;
    line-height: 1;
    width: 48px;
    height: 64px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
#lightbox-prev { left: -60px; }
#lightbox-next { right: -60px; }
#lightbox-prev:hover,
#lightbox-next:hover,
#lightbox-close:hover {
    background: rgba(255, 255, 255, 0.15);
}
`;

export const Lightbox = (() => {

    let _overlay = null;
    let _imagesContainer = null;
    let _captionEl = null;
    let _loadingEl = null; // re-appended on each open so it survives innerHTML reset
    let _imgEls = [];
    let _imageData = [];
    let _currentIndex = 0;

    function _injectStyles() {
        let style = document.createElement('style');
        style.textContent = _css;
        document.head.appendChild(style);
    }

    function _buildOverlay() {
        _injectStyles();

        _overlay = document.createElement('div');
        _overlay.id = 'lightbox-overlay';
        _overlay.innerHTML = `
            <div id="lightbox-container">
                <button id="lightbox-close" aria-label="Close">&#x2715;</button>
                <button id="lightbox-prev" aria-label="Previous">&#8249;</button>
                <div id="lightbox-images">
                    <img id="lightbox-loading" src="images/icons/icon-loading-soon.gif" alt="Loading..."/>
                </div>
                <div id="lightbox-caption"></div>
                <button id="lightbox-next" aria-label="Next">&#8250;</button>
            </div>
        `;

        _imagesContainer = _overlay.querySelector('#lightbox-images');
        _captionEl = _overlay.querySelector('#lightbox-caption');
        _loadingEl = _overlay.querySelector('#lightbox-loading');

        _overlay.addEventListener('click', (e) => {
            if (e.target === _overlay) _close();
        });
        _overlay.querySelector('#lightbox-close').addEventListener('click', _close);
        _overlay.querySelector('#lightbox-prev').addEventListener('click', () => _show(_currentIndex - 1));
        _overlay.querySelector('#lightbox-next').addEventListener('click', () => _show(_currentIndex + 1));

        document.body.appendChild(_overlay);
    }

    function _onKeydown(e) {
        if (e.key === 'ArrowLeft') _show(_currentIndex - 1);
        if (e.key === 'ArrowRight') _show(_currentIndex + 1);
        if (e.key === 'Escape') _close();
    }

    function _labelFor(image) {
        if (image.label) return image.label;
        let parts = image.url.split('/');
        return parts[parts.length - 1];
    }

    function _show(index) {
        _currentIndex = (index + _imgEls.length) % _imgEls.length;
        _imgEls.forEach((img, i) => {
            img.classList.toggle('lightbox-active', i === _currentIndex);
        });
        _captionEl.textContent = _labelFor(_imageData[_currentIndex]);

        let single = _imgEls.length <= 1;
        _overlay.querySelector('#lightbox-prev').style.display = single ? 'none' : '';
        _overlay.querySelector('#lightbox-next').style.display = single ? 'none' : '';
    }

    function _open(images, startIndex) {
        if (!_overlay) _buildOverlay();

        _imageData = images;
        _imagesContainer.innerHTML = '';
        _imagesContainer.appendChild(_loadingEl);

        _imgEls = images.map(image => {
            let img = document.createElement('img');
            img.src = image.url;
            img.alt = image.label || '';
            _imagesContainer.appendChild(img);
            return img;
        });

        _overlay.classList.add('open');
        document.addEventListener('keydown', _onKeydown);
        _show(startIndex || 0);
    }

    function _close() {
        if (_overlay) _overlay.classList.remove('open');
        document.removeEventListener('keydown', _onKeydown);
    }

    return {
        open: _open,
        close: _close
    };
})();
