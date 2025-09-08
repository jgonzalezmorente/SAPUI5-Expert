sap.ui.define([], function () {
    'use strict';
    const oBundle = sap.ui.getCore().getModel('i18n').getResourceBundle();    
    return {
        // hello: function(name, helloMsg) {
        //     return helloMsg.replace('{0}', name);
        // },
        hello: function(name) {
            return oBundle.getText('helloMsg', [name]);
        }

    };    
});