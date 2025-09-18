sap.ui.define([], function () {
    'use strict';
    return {
        hello: function(name) {
            const resourceBundle = this.getView().getModel('i18n').getResourceBundle();
            return resourceBundle.getText('helloMsg', [name]);
        }
    };
});