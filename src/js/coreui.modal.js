
var CoreUI = typeof CoreUI !== 'undefined' ? CoreUI : {};

CoreUI.modal = {

    _currentModal: null,

    /**
     * @param title
     * @param body
     * @param options
     * @returns {HTMLElement}
     */
    show: function (title, body, options) {

        body    = typeof body === "string" ? body : '';
        options = typeof options === 'object' ? options : {};

        let tplFooter = options.hasOwnProperty('footer') && typeof options.footer === "string"
            ? '<div class="modal-footer">' + options.footer + '</div>'
            : '';

        let size = options.hasOwnProperty('size') && typeof options.size === "string"
            ? (options.size ? 'modal-' + options.size : '')
            : 'modal-lg';

        let uniqueId = options.hasOwnProperty('id') && typeof options.id === "string"
            ? options.id
            : this._hashCode();

        let tpl =
            '<div class="modal fade" tabindex="-1" id="modal-' + uniqueId + '">' +
              '<div class="modal-dialog ' + size + '">' +
                '<div class="modal-content">' +
                  '<div class="modal-header">' +
                    '<h5 class="modal-title">' + title + '</h5>' +
                    '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
                  '</div>' +
                  '<div class="modal-body">' +
                    body +
                  '</div>' +
                  tplFooter +
                '</div>' +
              '</div>' +
            '</div>';


        $('body').append(tpl);
        let modalElement   = document.getElementById('modal-' + uniqueId);
        this._currentModal = new bootstrap.Modal(modalElement, {
            backdrop: true,
        })


        modalElement.addEventListener('show.bs.modal', function (e) {
            if (options.hasOwnProperty('onShow') && typeof options.onShow === 'function') {
                options.onShow(e);
            }
        });

        modalElement.addEventListener('shown.bs.modal', function (e) {
            if (options.hasOwnProperty('onShown') && typeof options.onShown === 'function') {
                options.onShown(e);
            }
        });

        modalElement.addEventListener('hide.bs.modal', function (e) {
            if (options.hasOwnProperty('onHide') && typeof options.onHide === 'function') {
                options.onHide(e);
            }
        });
        modalElement.addEventListener('hidden.bs.modal', function (e) {
            modalElement.remove();

            if (options.hasOwnProperty('onHidden') && typeof options.onHidden === 'function') {
                options.onHidden(e);
            }

        });

        this._currentModal.show();

        return modalElement;
    },


    /**
     *
     */
    hide: function () {

        if (this._currentModal) {
            this._currentModal.hide();
            this._currentModal = null;
        }
    },


    /**
     * @returns {string}
     * @private
     */
    _hashCode: function() {
        return this._crc32((new Date().getTime() + Math.random()).toString()).toString(16);
    },


    /**
     * @param str
     * @returns {number}
     * @private
     */
    _crc32: function (str) {

        for (var a, o = [], c = 0; c < 256; c++) {
            a = c;
            for (var f = 0; f < 8; f++) {
                a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1
            }
            o[c] = a
        }

        for (var n = -1, t = 0; t < str.length; t++) {
            n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))]
        }

        return (-1 ^ n) >>> 0;
    }
}