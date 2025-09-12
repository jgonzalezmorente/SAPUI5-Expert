sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',    
    'logaligroup/SAPUI5/model/formatter'    
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.m.MessageToast} MessageToast 
 */
function (
    Controller, 
    MessageToast,     
    formatter,
) {
    'use strict';
    return Controller.extend('logaligroup.SAPUI5.controllers.HelloPanel', {
        onInit: function() {
         
        },
        formatter,
        onShowHello: function() {
            // Read text from i18n model
            const oBundle = this.getView().getModel('i18n').getResourceBundle();
            // Read property from data model
            const sRecipient = this.getView().getModel().getProperty('/recipient/name');
            const sMsg = oBundle.getText('helloMsg', [sRecipient]);
            MessageToast.show(sMsg + 'hahah');
        },
        onOpenDialog: function() {
            this.getOwnerComponent().openHelloDialog();
        },

    });
});