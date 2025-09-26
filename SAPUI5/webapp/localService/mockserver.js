sap.ui.define([
    'sap/ui/core/util/MockServer',
    'sap/ui/model/json/JSONModel',
    'sap/base/util/UriParameters',
    'sap/base/Log'
], 
/**
 * @param{ typeof sap.ui.core.util.MockServer } MockServer
 * @param{ typeof sap.ui.model.json.JSONModel } JSONModel
 * @param{ typeof sap.base.util.UriParameters } UriParameters
 * @param{ typeof sap.base.Log } Log
 */

function(MockServer , JSONModel, UriParameters, Log) {
    'use strict';
    let oMockServer,
        _sAppPath = 'logaligroup/SAPUI5/',
        _sJsonFilesPath = _sAppPath + 'localService/mockdata';

    let oMockServerInterface = {
        /**
         * Intializes the mock server asynchronously
         * @protected
         * @param {object} oOptionsParameter 
         * @returns {Promise} a promise that is resolved when the mock server has been started
         */
        init: function(oOptionsParameter) {
            let oOptions = oOptionsParameter || {};
            return new Promise(function(fnResolve, fnReject) {
                let sManifestUrl = sap.ui.require.toUrl(_sAppPath + 'manifest.json'),
                    oManifestModel = new JSONModel(sManifestUrl);
                
                oManifestModel.attachRequestCompleted(function() {
                    let oUriParameters = new UriParameters(window.location.href);
                    //parse manifest for local metadata URI
                    let sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                    let oMainDataSource = oManifestModel.getProperty('/sap.app/dataSources/mainService');                    
                    let sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                    //ensure there is a trailing slash                    
                    let sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();
                    //create a mock server instance or stop the existing one to reinitialize
                    if (!oMockServer) {
                        oMockServer = new MockServer({
                            rootUri: sMockServerUrl
                        });
                    } else {
                        oMockServer.stop();
                    }

                    //configure mock server with the given options or default delay of 0.5s
                    MockServer.config({
                        autoRespond: true,
                        autoRespondAfter: (oOptions.delay || oUriParameters.get('serverDelay') || 500)
                    });

                    //simulate all request using mock data
                    oMockServer.simulate(sMetadataUrl, {
                        sMockdataBaseUrl: sJsonFilesUrl,
                        bGenerateMissingMockData: true
                    });

                    let aRequests = oMockServer.getRequests();

                    //compose an error response for each request
                    let fnResponse = function(iErrCode, sMessage, aRequest) {
                        aRequest.response = function(oXhr) {
                            oXhr.respond(iErrCode, {'Content-Type': 'text/plain;charset=utf-8', sMessage});
                        };                        
                    };

                    //simulate metadata errors
                    if (oOptions.metadataError || oUriParameters.get('metadataError')) {
                        aRequests.forEach( function (aEntry) {
                            if (aEntry.path.toString().indexof('$metadata') > -1) {
                                fnResponse(500, 'metadata Error', aEntry);
                            }
                        });
                    }

                    // simulate request errors
                    let sErrorParam = oOptions.errorType || oUriParameters.get('errorType');
                    let iErrorCode = sErrorParam === 'badRequest' ? 400 : 500;

                    if (sErrorParam) {
                        aRequests.forEach(function (aEntry) {
                            fnResponse(iErrorCode, sErrorParam, aEntry);
                        });
                    }

                    // set requests and start the server
                    oMockServer.setRequests(aRequests);
                    oMockServer.start();

                    Log.info('Running the app with mock data');
                    fnResolve();

                    oManifestModel.attachRequestFailed(function() {
                        let sError = 'Failed to load the application manifest';
                        Log.error(sError);
                        fnReject(new Error(sError));
                    });
                });
            });

        }
    };
    return oMockServerInterface;
});