/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class DataController {
        public static $inject = ['$state', 'agent', '$scope', '$timeout', '$interval'];

        private _domParser: DOMParser = new DOMParser();
        private _updateInterval: any;

        private processDataItems = () => {
            var items = this.devicesDocument.getElementsByTagName('DataItem');

            for (var i = 0; i < items.length; i++) {
                var item = items.item(i);

                var workingItem: IDataItem = {
                    category: item.getAttribute('category'),
                    type: item.getAttribute('type'),
                    id: item.getAttribute('id'),
                    
                    path: []
                };

                if (item.hasAttribute('subType')) workingItem.subType = item.getAttribute('subType');
                if (item.hasAttribute('name')) workingItem.name = item.getAttribute('name');
                if (item.hasAttribute('units')) workingItem.units = item.getAttribute('units');

                this.dataItems.push(workingItem);
                
                while(!!item.parentElement.parentElement){
                    item = item.parentElement.parentElement;
                    var componentParent = item.parentElement;
                    
                    var component: IComponent = {
                        id: item.getAttribute('id'),
                        type: item.tagName
                    }
                    if(item.hasAttribute('name')) component.name = item.getAttribute('name');
                    workingItem.path.unshift(component);
                    
                    if(componentParent.tagName !== 'Components') break;
                }
            }
        }

        public devicesDocument: Document;
        public dataItems: IDataItem[] = [];

        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService, private $interval: angular.IIntervalService) {
            agent.devices.then(devices => {
                this.devicesDocument = devices;
                this.processDataItems();
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

        public viewDevice = (name: string) => {
            this.$state.go('device', { device: name });
        }
        
        public fetch = () => {
            this.agent.current.then(dataitems => {
                var streams = dataitems.getElementsByTagName('ComponentStream');
                var values: {[id:string]:any} = {};
                var conditions: {[id:string]:any} = {};
                for(var i=0; i<streams.length; i++){
                    var stream = streams.item(i);
                    
                    var samples = stream.getElementsByTagName('Samples');
                    var events = stream.getElementsByTagName('Events');
                    var condition = stream.getElementsByTagName('Condition');
                    
                    for(var j=0; j<samples.length; j++){
                        var items = samples.item(j).childNodes;
                        for(var k=0; k<items.length; k++){
                            if(!(<Element>items.item(k)).getAttribute) continue;
                            values[(<Element>items.item(k)).getAttribute('dataItemId')] = items.item(k).textContent;
                        }
                    }
                    for(var j=0; j<events.length; j++){
                        var items = events.item(j).childNodes;
                        for(var k=0; k<items.length; k++){
                            if(!(<Element>items.item(k)).getAttribute) continue;
                            values[(<Element>items.item(k)).getAttribute('dataItemId')] = items.item(k).textContent;
                        }
                    }
                    for(var j=0; j<condition.length; j++){
                        var items = condition.item(j).childNodes;
                        for(var k=0; k<items.length; k++){
                            if(!(<Element>items.item(k)).getAttribute) continue;
                            values[(<Element>items.item(k)).getAttribute('dataItemId')] = items.item(k).textContent;
                            conditions[(<Element>items.item(k)).getAttribute('dataItemId')] = (<Element>items.item(k)).tagName;
                        }
                    }
                }
                
                for(var i=0; i<this.dataItems.length; i++){
                    var dataitem = this.dataItems[i];
                    if(values.hasOwnProperty(dataitem.id)){
                        dataitem.value = values[dataitem.id];
                        console.log(dataitem.id, ' == ', dataitem.value);
                    }
                    if(conditions.hasOwnProperty(dataitem.id)) dataitem.condition = conditions[dataitem.id];
                }
                this.$timeout(() => {
                    console.log('processed current dataItems');
                }, 0);
            });
        }

    }

    MTConnectViewer.app.controller('dataCtrl', MTConnectViewer.DataController);
}