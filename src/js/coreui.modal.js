
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

        let uniqueId = this._hashCode();
        let tpl =
            '<div class="modal fade" tabindex="-1" id="modal-' + uniqueId + '">' +
              '<div class="modal-dialog modal-lg">' +
                '<div class="modal-content">' +
                  '<div class="modal-header">' +
                    '<h5 class="modal-title">' + title + '</h5>' +
                    '<button type="button" class="btn-close" data-mdb-dismiss="modal"></button>' +
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
        this._currentModal = new mdb.Modal(modalElement, {
            backdrop: true
        })


        modalElement.addEventListener('hide.mdb.modal', function (e) {
            if (options.hasOwnProperty('onHide') && typeof options.onHide === 'function') {
                options.onHide(e);
            }
        });
        modalElement.addEventListener('hidden.mdb.modal', function (e) {
            modalElement.remove();

            if (options.hasOwnProperty('onHidden') && typeof options.onHidden === 'function') {
                options.onHidden(e);
            }
        });

        modalElement.addEventListener('show.mdb.modal', function (e) {
            if (options.hasOwnProperty('onShow') && typeof options.onShow === 'function') {
                options.onShow(e);
            }
        });

        modalElement.addEventListener('shown.mdb.modal', function (e) {
            if (options.hasOwnProperty('onShown') && typeof options.onShown === 'function') {
                options.onShown(e);
            }
        });

        modalElement.addEventListener('hidePrevented.mdb.modal', function (e) {
            if (options.hasOwnProperty('onHidePrevented') && typeof options.onHidePrevented === 'function') {
                options.onHidePrevented(e);
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
     * @returns {number}
     * @private
     */
    _hashCode: function() {

        let string = 'A' + new Date().getTime();

        for (var h = 0, i = 0; i < string.length; h &= h) {
            h = 31 * h + string.charCodeAt(i++);
        }

        return Math.abs(h);
    }
}