/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    app.directive('dataitem', () => {
        console.log("dataitem");
        return {
            restrict: 'EA',
            templateUrl: 'templates/directives/data-item.html',
            scope: {item: '='}
        };
    });
}