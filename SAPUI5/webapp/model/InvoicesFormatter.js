sap.ui.define([
    'sap/ui/model/type/Currency'
],
/**
 * @param {typeof sap.ui.model.type.Currency} Currency
 */
function (Currency) {
    'use strict';
    return {
        invoiceStatus: function(sStatus) {
            const resourceBundle = this.getView().getModel('i18n').getResourceBundle();
            switch (sStatus) {
                case 'A': return resourceBundle.getText('invoiceStatusA')
                case 'B': return resourceBundle.getText('invoiceStatusB')
                case 'C': return resourceBundle.getText('invoiceStatusC')
                default: return sStatus;
            }
        },
        formatExtendedPrice: function(price, currency) {
            const rounded = Math.round(100 * parseFloat(price)) / 100;
            const oCurrency = new Currency({
                showMeasure: false,
            });
            const sFormatted = oCurrency.formatValue([rounded, currency], 'string');
            return sFormatted;
        }
    }
});