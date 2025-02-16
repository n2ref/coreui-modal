
import 'ejs/ejs.min';
import modal        from "./modal";
import ModalTpl     from "./modal.tpl";
import ModalUtils   from "./modal.utils";
import ModalPrivate from "./modal.private";

class ModalInstance {

    _options = {
        id: '',
        lang: 'en',
        backdrop: true,
        loadUrl: null,
        size: 'lg',
        title: null,
        body: null,
        footer: null
    };

    _id     = '';
    _modal  = null;
    _events = {};


    /**
     * Инициализация
     * @param {Object} options
     */
     constructor(options) {

        this._options = $.extend(true, {}, this._options, options);
        this._id      = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id
            ? this._options.id
            : ModalUtils.hashCode();
    }


    /**
     * Получение идентификатора
     * @returns {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions() {
        return $.extend(true, {}, this._options);
    }


    /**
     * Установка содержимого модала
     * @param {string} content
     */
    setContent(content) {

        let container = $('#coreui-modal-' + this.getId() + ' .modal-body');

        if (container[0]) {
            container.html(ModalPrivate.renderContent(this, content));
            ModalPrivate.trigger(this, 'content_change', this, [ this ]);
            
        } else if (ModalUtils.isObject(content)) {
            this._options.body = content;
        }
    }


    /**
     Установка заголовка модала
     * @param {string} content
     */
    setTitle(content) {

        let container = $('#coreui-modal-' + this.getId() + ' .modal-title');

        if (container[0]) {
            container.html(content);
            ModalPrivate.trigger(this, 'title_change', this, [ this ]);
        }
    }


    /**
     Установка подвала модала
     * @param {string} content
     */
    setFooter(content) {

        let container = $('#coreui-modal-' + this.getId());

        if (container[0]) {
            let footer = container.find('.modal-footer');

            if (footer[0]) {
                footer.html(content);
            } else {
                container.find('.modal-content').append('<div class="modal-footer">' + content + '</div>');
            }

            ModalPrivate.trigger(this, 'footer_change', this, [ this ]);
        }
    }


    /**
     * Загрузка содержимого модала
     * @param {string} url
     */
    loadContent(url) {

        let that      = this;
        let container = $('#coreui-modal-' + this.getId() + ' .modal-body');


        if (container[0]) {
            let html = ejs.render(ModalTpl['loading.html'], {
                lang: that.getLang()
            });

            container.html(html);

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    ModalPrivate.trigger(that, 'content_load_before', that, [ that, xhr ]);
                },
                success: function (result) {
                    ModalPrivate.trigger(that, 'content_load_success', that, [ that, result ]);

                    container.html(ModalPrivate.renderContent(that, result));

                    ModalPrivate.trigger(that, 'content_change', that, [ that ]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    ModalPrivate.trigger(that, 'content_load_error', that, [ that, xhr, textStatus, errorThrown ]);
                },
                complete: function(xhr, textStatus) {
                    ModalPrivate.trigger(that, 'content_load_complete', that, [ that, xhr, textStatus ]);
                },
            });
        }
    }


    /**
     * Показ модала
     * @return {HTMLElement}
     */
    show() {

        let modalElement = document.getElementById('coreui-modal-' + this.getId());

        if (modalElement) {
            return modalElement;
        }


        let modalContainer = $(ejs.render(ModalTpl['modal.html'], {
            id: this.getId(),
            modal: this._options,
        }));

        if (this._options.body) {
            modalContainer.find('.modal-body')
                .html(ModalPrivate.renderContent(this, this._options.body));
        }

        if (this._options.footer) {
            modalContainer.find('.modal-footer')
                .html(this._options.footer);
        }


        $('body').append(modalContainer);


        modalElement = document.getElementById('coreui-modal-' + this.getId());
        this._modal  = new bootstrap.Modal(modalElement, {
            backdrop: this._options.backdrop
        })

        let that = this;

        modalElement.addEventListener('show.bs.modal', function (e) {
            ModalPrivate.trigger(that, 'modal_show', that, [ that ]);
        });

        modalElement.addEventListener('shown.bs.modal', function (e) {
            ModalPrivate.trigger(that, 'modal_shown', that, [ that ]);
        });

        modalElement.addEventListener('hide.bs.modal', function (e) {
            ModalPrivate.trigger(that, 'modal_hide', that, [ that ]);
        });

        modalElement.addEventListener('hidden.bs.modal', function (e) {
            modalElement.remove();

            ModalPrivate.trigger(that, 'modal_hidden', that, [ that ]);
        });

        this._modal.show();

        if (this._options.loadUrl) {
            this.loadContent(this._options.loadUrl);
        }

        return modalElement;
    }


    /**
     * Скрытие модала
     */
    hide() {

        if (this._modal) {
            this._modal.hide();
            this._modal = null;
        }
    }


    /**
     * Удаление модала
     */
    destruct() {

        $('#coreui-modal-' + this.getId()).remove();
        delete modal._instances[this.getId()];
    }


    /**
     * Получение настроек языка
     * @private
     */
    getLang() {

        return modal.lang.hasOwnProperty(this._options.lang)
           ? modal.lang[this._options.lang]
           : modal.lang['en'];
    }


    /**
     * Регистрация функции на событие
     * @param eventName
     * @param callback
     * @param context
     * @param singleExec
     */
    on(eventName, callback, context, singleExec) {

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


export default ModalInstance;