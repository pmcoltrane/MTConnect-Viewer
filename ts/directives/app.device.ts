/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    app.directive('device', () => {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/device.html'
        };
    });
}