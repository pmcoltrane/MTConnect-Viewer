/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    app.directive('component', () => {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/component.html',
            scope: {component: '='}
        };
    });
}