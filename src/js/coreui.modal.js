
var CoreUI = typeof CoreUI !== 'undefined' ? CoreUI : {};

CoreUI.modal = {

    lang: {},
    _instances: {},
    _settings: {
        lang: 'en'
    },

    /**
     * @param {object} options
     * @returns {CoreUI.modal.instance}
     */
    create: function (options) {

        let instance = $.extend(true, {}, this.instance);
        instance._init(options instanceof Object ? options : {});

        let layoutId = instance.getId();
        this._instances[layoutId] = instance;

        return instance;
    },


    /**
     * @param {string} id
     * @returns {CoreUI.modal.instance|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ($('#coreui-modal-' + this._instances[id])[0]) {
            delete this._instances[id];
            return null;
        }

        return this._instances[id];
    },


    /**
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
            modal.on('show.coreui.modal', options.onShow);
        }

        if (typeof options.onShown === 'function') {
            modal.on('shown.coreui.modal', options.onShown);
        }

        if (typeof options.onHide === 'function') {
            modal.on('hide.coreui.modal', options.onHide);
        }

        if (typeof options.onHidden === 'function') {
            modal.on('hidden.coreui.modal', options.onHidden);
        }

        return modal.show();
    },


    /**
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
            modal.on('show.coreui.modal', options.onShow);
        }

        if (typeof options.onShown === 'function') {
            modal.on('shown.coreui.modal', options.onShown);
        }

        if (typeof options.onHide === 'function') {
            modal.on('hide.coreui.modal', options.onHide);
        }

        if (typeof options.onHidden === 'function') {
            modal.on('hidden.coreui.modal', options.onHidden);
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
                    instance.on('hidden.coreui.modal', callback);
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
                    instance.on('hidden.coreui.modal', callback);
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

        CoreUI.modal._settings = $.extend(this, {}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (CoreUI.modal._settings.hasOwnProperty(name)) {
            value = CoreUI.modal._settings[name];
        }

        return value;
    }
}