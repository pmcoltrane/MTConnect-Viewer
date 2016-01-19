/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class DeviceController {
        
        public name: string;
        public device: any;

        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService) {
            this.name = this.$state.params['device'];
            
            this.agent.devices
            .then(devices => {
                var matches:any[] = [];
                for(var i in devices){
                    if(devices[i]._name === this.name) matches.push(devices[i]);
                }
                return matches;
            })
            .then(devices => {
                if(devices.length) this.$timeout(() => {this.device = devices[0];}, 0); 
            });
        }
        
    }

    DeviceController.$inject = ['$state', 'agent', '$scope', '$timeout'];
    MTConnectViewer.app.controller('deviceCtrl', MTConnectViewer.DeviceController);
}