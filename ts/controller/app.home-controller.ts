/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class HomeController {

        public devicesDocument: any;

        public constructor(private $state, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService) {
            agent.getDevices()
            .then(result => {
                $timeout(() => {
                    this.devicesDocument = result.MTConnectDevices;
                }, 0);
            })
            .catch(err => {
                console.error(err);
            })
            ;
        }
        
    }

    HomeController.$inject = ['$state', 'agent', '$scope', '$timeout'];
    MTConnectViewer.app.controller('homeCtrl', MTConnectViewer.HomeController);
}