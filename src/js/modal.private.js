import ModalUtils from "./modal.utils";

let ModalPrivate = {

    /**
     * Выполнение события
     * @param {object} modal
     * @param {string} name
     * @param {object} context
     * @param {Array}  params
     * @private
     */
    trigger: function(modal, name, context, params) {

        params = params || [];

        if (modal._events.hasOwnProperty(name) && modal._events[name].length > 0) {
            for (var i = 0; i < modal._events[name].length; i++) {
                let callback = modal._events[name][i].callback;

                context = modal._events[name][i].context || context;

                callback.apply(context, params);

                if (modal._events[name][i].singleExec) {
                    modal._events[name].splice(i, 1);
                    i--;
                }
            }
        }
    },


    /**
     * Формирование контента компонента
     * @param {object} modal
     * @param {*}      data
     * @returns {Array}
     * @private
     */
    renderContent: function(modal, data) {

        let result = [];

        if (typeof data === 'string') {
            result.push(data);

        } else if (data instanceof Object) {
            if ( ! Array.isArray(data)) {
                data = [ data ];
            }

            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === 'string') {
                    result.push(data[i]);

                } else if (data[i] instanceof Object &&
                    typeof data[i].render === 'function' &&
                    typeof data[i].initEvents === 'function'
                ) {
                    result.push(data[i].render());

                    modal.on('modal_shown', data[i].initEvents, data[i], true);

                } else {
                    if ( ! Array.isArray(data[i]) &&
                        data[i].hasOwnProperty('component') &&
                        data[i].component.substring(0, 6) === 'coreui'
                    ) {
                        let name = data[i].component.split('.')[1];

                        if (CoreUI.hasOwnProperty(name) &&
                            ModalUtils.isObject(CoreUI[name])
                        ) {
                            let instance = CoreUI[name].create(data[i]);
                            result.push(instance.render());

                            modal.on('modal_shown', instance.initEvents, instance, true);
                        } else {
                            result.push(JSON.stringify(data[i]));
                        }

                    } else {
                        result.push(JSON.stringify(data[i]));
                    }
                }
            }
        }

        return result;
    }
}


export default ModalPrivate;