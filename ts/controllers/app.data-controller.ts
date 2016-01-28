/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class DataController {
        public static $inject = ['$state', 'agent', '$scope', '$timeout', '$interval'];

        private _updateInterval: any;

        public dataItems: IDataItem[] = [];
        public filter: string;

        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService, private $interval: angular.IIntervalService) {
            agent.getDevices().then(devices => {
                this.dataItems = Object.keys(devices).map(item => devices[item]);
                $timeout(() => {
                    console.log('processed', this.dataItems.length, 'dataItems');
                }, 0);

                this._updateInterval = $interval(this.fetch, 10000);

                $scope.$on('$destroy', () => {
                    $interval.cancel(this._updateInterval);
                });

                this.fetch();
            });
        }

        public fetch = () => {
            this.agent.getCurrent().then(samples => {
                for(var i in this.dataItems){
                    var item = this.dataItems[i];
                    if(samples[item.id]) this.dataItems[i].current = samples[item.id];   
                }
                this.$timeout(() => {
                    console.log('processed ' + this.dataItems.length + ' current dataItems');
                }, 0);
            });
        }

        public isFiltered = (dataitem: IDataItem): boolean => {
            if (!this.filter || this.filter.length === 0) return true;

            var regex = new RegExp('^' + this.filter, 'i');
            if (regex.exec(dataitem.name || dataitem.id)) return true;
            if (regex.exec(dataitem.type)) return true;
            if (regex.exec(dataitem.subType)) return true;

            for (var i in dataitem.path) if (
                regex.exec(dataitem.path[i].name)
                || regex.exec(dataitem.path[i].type)
                || regex.exec(dataitem.path[i].id)
            ) return true;

            console.log('no match with ', dataitem.name);
            return false;
        }

    }


    MTConnectViewer.app.controller('dataCtrl', MTConnectViewer.DataController);
}