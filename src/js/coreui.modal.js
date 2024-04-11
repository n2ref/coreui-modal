import coreuiModalInstance from "./coreui.modal.instance";

let coreuiModal = {

    lang: {},
    _instances: {},
    _settings: {
        lang: 'en'
    },

    /**
     * Создание экземпляра
     * @param {object} options
     * @returns {object}
     */
    create: function (options) {

        let instance = $.extend(true, {}, coreuiModalInstance);

        if ( ! options.hasOwnProperty('lang')) {
            options.lang = this.getSetting('lang');
        }

        instance._init(options instanceof Object ? options : {});

        let layoutId = instance.getId();
        this._instances[layoutId] = instance;

        return instance;
    },


    /**
     * Получение созданного ранее экземпляра
     * @param {string} id
     * @returns {object|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ( ! $('#coreui-modal-' + this._instances[id])[0]) {
            delete this._instances[id];
            return null;
        }

        return this._instances[id];
    },


    /**
     * Создание и показ модала
     * @param title
     * @param body
     * @param options
     * @returns {HTMLElement}
     */
    show: function (title, body, options) {

        options = typeof options === 'object' && ! Array.isArray(options) && options !== null
                  ? options
                  : {};

        options = $.extend(true, {}, options, {
            title : title,
            body : body,
        });

        let modal = this.create(options);

        if (typeof options.onShow === 'function') {
            modal.on('modal_show', options.onShow);
        }

        if (typeof options.onShown === 'function') {
            modal.on('modal_shown', options.onShown);
        }

        if (typeof options.onHide === 'function') {
            modal.on('modal_hide', options.onHide);
        }

        if (typeof options.onHidden === 'function') {
            modal.on('modal_hidden', options.onHidden);
        }

        return modal.show();
    },


    /**
     * Создание, показ модала и загрузка содержимого по ссылке
     * @param title
     * @param url
     * @param options
     * @returns {HTMLElement}
     */
    showLoad: function (title, url, options) {

        options = typeof options === 'object' && ! Array.isArray(options) && options !== null
            ? options
            : {};

        options = $.extend(true, {}, options, {
            title : title,
            loadUrl : url,
        });

        let modal = this.create(options);

        if (typeof options.onShow === 'function') {
            modal.on('modal_show', options.onShow);
        }

        if (typeof options.onShown === 'function') {
            modal.on('modal_shown', options.onShown);
        }

        if (typeof options.onHide === 'function') {
            modal.on('modal_hide', options.onHide);
        }

        if (typeof options.onHidden === 'function') {
            modal.on('modal_hidden', options.onHidden);
        }


        return modal.show();
    },


    /**
     * Скрытие последнего открытого модала
     * @param {function} callback
     */
    hideLast: function (callback) {

        let instances = this._instances.reverse();

        $.each(instances, function (key, instance) {
            let modalElement = document.getElementById('coreui-modal-' + instance.getId());

            if (modalElement) {
                if (typeof callback === 'function') {
                    instance.on('modal_hidden', callback);
                }

                instance.hide();
                return false;
            }
        });
    },


    /**
     * Скрытие всех открытых модалов
     * @param {function} callback
     */
    hideAll: function (callback) {

        if (typeof callback === 'function') {
            $.each(this._instances, function (key, instance) {
                let modalElement = document.getElementById('coreui-modal-' + instance.getId());

                if (modalElement) {
                    instance.on('modal_hidden', callback);
                    return false;
                }
            });
        }


        let instances = this._instances.reverse();

        $.each(instances, function (key, instance) {
            let modalElement = document.getElementById('coreui-modal-' + instance.getId());

            if (modalElement) {
                instance.hide();
            }
        });
    },


    /**
     * Установка настроек
     * @param {object} settings
     */
    setSettings: function(settings) {

        this._settings = $.extend(this, {}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (this._settings.hasOwnProperty(name)) {
            value = this._settings[name];
        }

        return value;
    }
}


export default coreuiModal;