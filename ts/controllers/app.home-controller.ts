/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer {

    export class HomeController {
        public static $inject = ['$state', 'agent', '$scope', '$timeout'];

        private _domParser: DOMParser = new DOMParser();

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

        public constructor(private $state: angular.ui.IStateService, private agent: IAgent, private $scope: angular.IScope, private $timeout: angular.ITimeoutService) {
            agent.devices.then(devices => {
                this.devicesDocument = devices;
                this.processDataItems();
                $timeout(() => {
                    console.log('processed', this.dataItems.length, 'dataItems');
                }, 0);
            })
                ;
        }

        public viewDevice = (name: string) => {
            this.$state.go('device', { device: name });
        }

    }

    MTConnectViewer.app.controller('homeCtrl', MTConnectViewer.HomeController);
}