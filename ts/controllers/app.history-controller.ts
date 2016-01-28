/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class HistoryController {
        public static $inject = ['$state', 'agent', '$scope', '$timeout', '$interval'];

        public dataItemIds: string[];
        public samples: {[name: string]: IDataItemSample[]};
        
        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService, private $interval: angular.IIntervalService) {
            this.dataItemIds = this.$state.params['id'].split(',');
            
            this.agent.getSamples(this.dataItemIds)
            .then(result => {
               this.samples = result;
               this.$timeout(() => {
                   console.log('processed ' + Object.keys(this.samples).length + ' dataitems');
               }, 0);
            });
        }

        
    }


    MTConnectViewer.app.controller('historyCtrl', MTConnectViewer.HistoryController);
}