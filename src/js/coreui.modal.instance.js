
CoreUI.modal.instance = {

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
    _modal: null,
    _events: {},


    /**
     * Инициализация
     * @param options
     */
    _init: function (options) {

        this._options.lang = CoreUI.modal.getSetting('lang');

        this._options = $.extend(true, {}, this._options, options);

        if ( ! this._options.id) {
            this._options.id = CoreUI.modal.utils.hashCode();
        }
    },


    /**
     *
     * @returns {*}
     */
    getId: function () {
        return this._options.id;
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
    setBodyContent: function (content) {

        let container = $('#coreui-modal-' + this._options.id + ' .modal-body');

        if (container[0]) {
            container.html(this._renderContent(content));
            this._trigger('change-body.coreui.modal', this, [ this ]);
        }
    },


    /**
     Установка заголовка модала
     * @param {string} content
     */
    setTitleContent: function (content) {

        let container = $('#coreui-modal-' + this._options.id + ' .modal-title');

        if (container[0]) {
            container.html(content);
            this._trigger('change-title.coreui.modal', this, [ this ]);
        }
    },


    /**
     Установка подвала модала
     * @param {string} content
     */
    setFooterContent: function (content) {

        let container = $('#coreui-modal-' + this._options.id);

        if (container[0]) {
            let footer = container.find('.modal-footer');

            if (footer[0]) {
                footer.html(content);
            } else {
                container.find('.modal-content').append('<div class="modal-footer">' + content + '</div>');
            }

            this._trigger('change-footer.coreui.modal', this, [ this ]);
        }
    },


    /**
     * Загрузка содержимого модала
     * @param {string} url
     */
    loadBodyContent: function (url) {

        let that      = this;
        let container = $('#coreui-modal-' + this._options.id + ' .modal-body');


        if (container[0]) {
            let html = CoreUI.modal.ejs.render(CoreUI.modal.tpl['loading.html'], {
                lang: that.getLang()
            });

            container.html(html);

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    that._trigger('before-load.coreui.modal', that, [ that, xhr ]);
                },
                success: function (result) {
                    container.html(that._renderContent(result));

                    that._trigger('success-load.coreui.modal', that, [ that, result ]);
                    that._trigger('change-body.coreui.modal', that, [ that ]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    that._trigger('error-load.coreui.modal', that, [ that, xhr, textStatus, errorThrown ]);
                },
                complete: function(xhr, textStatus) {
                    that._trigger('complete-load.coreui.modal', that, [ that, xhr, textStatus ]);
                },
            });
        }
    },


    /**
     * Показ модала
     * @return {HTMLElement}
     */
    show: function() {

        let modalElement = document.getElementById('coreui-modal-' + this._options.id);

        if (modalElement) {
            return modalElement;
        }


        let html = CoreUI.modal.ejs.render(CoreUI.modal.tpl['modal.html'], {
            modal: this._options,
            body: this._options.body ? this._renderContent(this._options.body) : ''
        });


        $('body').append(html);

        modalElement = document.getElementById('coreui-modal-' + this._options.id);
        this._modal  = new bootstrap.Modal(modalElement, {
            backdrop: this._options.backdrop,
        })

        let that = this;

        modalElement.addEventListener('show.bs.modal', function (e) {
            that._trigger('show.coreui.modal', that, [ that ]);
        });

        modalElement.addEventListener('shown.bs.modal', function (e) {
            that._trigger('shown.coreui.modal', that, [ that ]);
        });

        modalElement.addEventListener('hide.bs.modal', function (e) {
            that._trigger('hide.coreui.modal', that, [ that ]);
        });

        modalElement.addEventListener('hidden.bs.modal', function (e) {
            modalElement.remove();

            that._trigger('hidden.coreui.modal', that, [ that ]);
        });

        this._modal.show();

        if (this._options.loadUrl) {
            this.loadBodyContent(this._options.loadUrl);
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

        $('#coreui-modal-' + this._options.id).remove();
        delete CoreUI.modal._instances[this.getId()];
    },


    /**
     * Получение настроек языка
     * @private
     */
    getLang: function () {

        return CoreUI.modal.lang.hasOwnProperty(this._options.lang)
               ? CoreUI.modal.lang[this._options.lang]
               : CoreUI.modal.lang['en'];
    },


    /**
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
    },


    /**
     * Выполнение события
     * @param name
     * @param context
     * @param params
     * @private
     */
    _trigger: function(name, context, params) {

        params = params || [];

        if (this._events.hasOwnProperty(name) && this._events[name].length > 0) {
            for (var i = 0; i < this._events[name].length; i++) {
                let callback = this._events[name][i].callback;

                context = this._events[name][i].context || context;

                callback.apply(context, params);

                if (this._events[name][i].singleExec) {
                    this._events[name].splice(i, 1);
                    i--;
                }
            }
        }
    },


    /**
     *
     * @param data
     * @returns {string}
     * @private
     */
    _renderContent: function(data) {

        let result          = [];
        let alloyComponents = [
            'coreui.table',
            'coreui.form',
            'coreui.panel',
            'coreui.layout',
            'coreui.tabs',
            'coreui.info',
            'coreui.chart',
        ];

        if (typeof data === 'string') {
            result.push(data);

        } else if (data instanceof Object) {
            if ( ! Array.isArray(data)) {
                data = [ data ];
            }

            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === 'string') {
                    result.push(data[i]);

                } else {
                    if ( ! Array.isArray(data[i]) &&
                        data[i].hasOwnProperty('component') &&
                        alloyComponents.indexOf(data[i].component) >= 0
                    ) {
                        let name = data[i].component.split('.')[1];

                        if (CoreUI.hasOwnProperty(name)) {
                            let instance = CoreUI[name].create(data[i]);
                            result.push(instance.render());

                            this.on('shown.coreui.modal', instance.initEvents, instance, true);
                        } else {
                            result.push(JSON.stringify(data[i]));
                        }

                    } else {
                        result.push(JSON.stringify(data[i]));
                    }
                }
            }
        }

        return result.join('');
    }
}