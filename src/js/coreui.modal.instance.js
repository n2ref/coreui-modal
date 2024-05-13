
import 'ejs/ejs.min';
import coreuiModal        from "./coreui.modal";
import coreuiModalTpl     from "./coreui.modal.templates";
import coreuiModalUtils   from "./coreui.modal.utils";
import coreuiModalPrivate from "./coreui.modal.private";

let coreuiModalInstance = {

    _options: {
        id: '',
        lang: 'en',
        backdrop: true,
        loadUrl: null,
        size: 'lg',
        title: null,
        body: null,
        footer: null
    },

    _id: '',
    _modal: null,
    _events: {},


    /**
     * Инициализация
     * @param options
     */
    _init: function (options) {

        this._options = $.extend(true, {}, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : coreuiModalUtils.hashCode();
    },


    /**
     * Получение идентификатора
     * @returns {string}
     */
    getId: function () {
        return this._id;
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Установка содержимого модала
     * @param {string} content
     */
    setContent: function (content) {

        let container = $('#coreui-modal-' + this.getId() + ' .modal-body');

        if (container[0]) {
            container.html(coreuiModalPrivate.renderContent(this, content));
            coreuiModalPrivate.trigger(this, 'content_change', this, [ this ]);
        }
    },


    /**
     Установка заголовка модала
     * @param {string} content
     */
    setTitle: function (content) {

        let container = $('#coreui-modal-' + this.getId() + ' .modal-title');

        if (container[0]) {
            container.html(content);
            coreuiModalPrivate.trigger(this, 'title_change', this, [ this ]);
        }
    },


    /**
     Установка подвала модала
     * @param {string} content
     */
    setFooter: function (content) {

        let container = $('#coreui-modal-' + this.getId());

        if (container[0]) {
            let footer = container.find('.modal-footer');

            if (footer[0]) {
                footer.html(content);
            } else {
                container.find('.modal-content').append('<div class="modal-footer">' + content + '</div>');
            }

            coreuiModalPrivate.trigger(this, 'footer_change', this, [ this ]);
        }
    },


    /**
     * Загрузка содержимого модала
     * @param {string} url
     */
    loadContent: function (url) {

        let that      = this;
        let container = $('#coreui-modal-' + this.getId() + ' .modal-body');


        if (container[0]) {
            let html = ejs.render(coreuiModalTpl['loading.html'], {
                lang: that.getLang()
            });

            container.html(html);

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    coreuiModalPrivate.trigger(that, 'content_load_before', that, [ that, xhr ]);
                },
                success: function (result) {
                    container.html(coreuiModalPrivate.renderContent(that, result));

                    coreuiModalPrivate.trigger(that, 'content_load_success', that, [ that, result ]);
                    coreuiModalPrivate.trigger(that, 'content_change', that, [ that ]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    coreuiModalPrivate.trigger(that, 'content_load_error', that, [ that, xhr, textStatus, errorThrown ]);
                },
                complete: function(xhr, textStatus) {
                    coreuiModalPrivate.trigger(that, 'content_load_complete', that, [ that, xhr, textStatus ]);
                },
            });
        }
    },


    /**
     * Показ модала
     * @return {HTMLElement}
     */
    show: function() {

        let modalElement = document.getElementById('coreui-modal-' + this.getId());

        if (modalElement) {
            return modalElement;
        }


        let html = ejs.render(coreuiModalTpl['modal.html'], {
            id: this.getId(),
            modal: this._options,
            body: this._options.body ? coreuiModalPrivate.renderContent(this, this._options.body) : ''
        });


        $('body').append(html);


        modalElement = document.getElementById('coreui-modal-' + this.getId());
        this._modal  = new bootstrap.Modal(modalElement, {
            backdrop: this._options.backdrop
        })

        let that = this;

        modalElement.addEventListener('show.bs.modal', function (e) {
            coreuiModalPrivate.trigger(that, 'modal_show', that, [ that ]);
        });

        modalElement.addEventListener('shown.bs.modal', function (e) {
            coreuiModalPrivate.trigger(that, 'modal_shown', that, [ that ]);
        });

        modalElement.addEventListener('hide.bs.modal', function (e) {
            coreuiModalPrivate.trigger(that, 'modal_hide', that, [ that ]);
        });

        modalElement.addEventListener('hidden.bs.modal', function (e) {
            modalElement.remove();

            coreuiModalPrivate.trigger(that, 'modal_hidden', that, [ that ]);
        });

        this._modal.show();

        if (this._options.loadUrl) {
            this.loadContent(this._options.loadUrl);
        }

        return modalElement;
    },


    /**
     * Скрытие модала
     */
    hide: function () {

        if (this._modal) {
            this._modal.hide();
            this._modal = null;
        }
    },


    /**
     * Удаление модала
     */
    destruct: function () {

        $('#coreui-modal-' + this.getId()).remove();
        delete coreuiModal._instances[this.getId()];
    },


    /**
     * Получение настроек языка
     * @private
     */
    getLang: function () {

        return coreuiModal.lang.hasOwnProperty(this._options.lang)
           ? coreuiModal.lang[this._options.lang]
           : coreuiModal.lang['en'];
    },


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     * @param singleExec
     */
    on: function(eventName, callback, context, singleExec) {

        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }

        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: !! singleExec,
        });
    }
}


export default coreuiModalInstance;