/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class HomeController {
        public static $inject = ['$state', 'agent', '$scope', '$timeout'];

        public devicesDocument: any;

        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService) {
            agent.devices.then(devices => {
                $timeout(()=> {
                    this.devicesDocument = devices;
                }, 0);
            })
            ;
        }
        
        public viewDevice = (name: string) => {
            this.$state.go('device', {device: name});
        }
        
    }

    MTConnectViewer.app.controller('homeCtrl', MTConnectViewer.HomeController);
}