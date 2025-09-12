sap.ui.define([
    'sap/ui/core/mvc/Controller'
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 */
function (
    Controller, 
) {
    'use strict';
    return Controller.extend('logaligroup.SAPUI5.controllers.App', {
        onInit: function() {
         
        },
        onOpenDialogHeader: function() {
            this.getOwnerComponent().openHelloDialog();
        }

    });
});