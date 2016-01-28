/// <reference path="../typings/tsd.d.ts" />
'use strict';
declare var X2JS: any;

module MTConnectViewer {

    export interface IAgent {
        baseUrl: string;

        getDevices: () => angular.IPromise<{ [id: string]: IDataItem }>;
        getCurrent: () => angular.IPromise<{ [id: string]: IDataItemSample }>;
        getSamples: (ids: string[]) => angular.IPromise<{ [id: string]: IDataItemSample[] }>;
    }

    export class Agent implements IAgent {

        private _domParser: DOMParser = new DOMParser();
        private _devicesDocument: XMLDocument;

        public baseUrl: string;

        private _dataItems: { [id: string]: IDataItem } = {};

        private processDataItems = (): { [id: string]: IDataItem } => {
            var items = this._devicesDocument.getElementsByTagName('DataItem');

            for (var i = 0; i < items.length; i++) {
                var item = items.item(i);

                var workingItem: IDataItem = {
                    category: item.getAttribute('category'),
                    type: item.getAttribute('type'),
                    id: item.getAttribute('id'),

                    path: [],
                    current: {}
                };

                if (item.hasAttribute('subType')) workingItem.subType = item.getAttribute('subType');
                if (item.hasAttribute('name')) workingItem.name = item.getAttribute('name');
                if (item.hasAttribute('units')) workingItem.units = item.getAttribute('units');

                this._dataItems[workingItem.id] = workingItem;

                while (!!item.parentElement.parentElement) {
                    item = item.parentElement.parentElement;
                    var componentParent = item.parentElement;

                    var component: IComponent = {
                        id: item.getAttribute('id'),
                        type: item.tagName
                    }
                    if (item.hasAttribute('name')) component.name = item.getAttribute('name');
                    workingItem.path.unshift(component);

                    if (componentParent.tagName !== 'Components') break;
                }
            }
            return this._dataItems;
        }

        private extractDataItems = (document: XMLDocument): { [id: string]: Element[] } => {
            var streams = document.getElementsByTagName('ComponentStream');
            var values: { [id: string]: Element[] } = {};


            // loop through all ComponentStream elements
            for (var i = 0; i < streams.length; i++) {
                var stream = streams.item(i);

                var samples = stream.getElementsByTagName('Samples');
                var events = stream.getElementsByTagName('Events');
                var condition = stream.getElementsByTagName('Condition');
                
                // TODO: refactor this
                
                // process samples
                for (var j = 0; j < samples.length; j++) {
                    var items = samples.item(j).childNodes;
                    for (var k = 0; k < items.length; k++) {
                        if (!(<Element>items.item(k)).getAttribute) continue;
                        var id = (<Element>items.item(k)).getAttribute('dataItemId');
                        if (!values[id]) values[id] = [];
                        values[id].push(<Element>items.item(k));
                    }
                }
                
                // process events
                for (var j = 0; j < events.length; j++) {
                    var items = events.item(j).childNodes;
                    for (var k = 0; k < items.length; k++) {
                        if (!(<Element>items.item(k)).getAttribute) continue;
                        var id = (<Element>items.item(k)).getAttribute('dataItemId');
                        if (!values[id]) values[id] = [];
                        values[id].push(<Element>items.item(k));
                    }
                }
                
                // process condition
                for (var j = 0; j < condition.length; j++) {
                    var items = condition.item(j).childNodes;
                    for (var k = 0; k < items.length; k++) {
                        if (!(<Element>items.item(k)).getAttribute) continue;
                        var id = (<Element>items.item(k)).getAttribute('dataItemId');
                        if (!values[id]) values[id] = [];
                        values[id].push(<Element>items.item(k));
                    }
                }
            }

            return values;
        }

        private processCurrent = (document: XMLDocument): { [id: string]: IDataItemSample } => {
            var values: { [id: string]: Element[] } = this.extractDataItems(document);
            var ret: { [id: string]: IDataItemSample } = {};


            // pull out the data we want and push it into the return object
            for (var itemId in values) {
                var elem = values[itemId][0];
                var sample: IDataItemSample = {
                    value: elem.textContent,
                    sequence: parseInt(elem.getAttribute('sequence')),
                    timestamp: new Date(elem.getAttribute('timestamp'))
                };
                if (this._dataItems[itemId] && this._dataItems[itemId].category === 'CONDITION') {
                    sample.condition = elem.tagName;
                }
                ret[itemId] = sample;
            }

            return ret;
        }

        private processSamples = (document: XMLDocument): { [id: string]: IDataItemSample[] } => {
            var values: { [id: string]: Element[] } = this.extractDataItems(document);
            var ret: { [id: string]: IDataItemSample[] } = {};
            
            // pull out the data we want and push it into the return object
            for (var itemId in values) {
                ret[itemId] = ret[itemId] || [];
                for (var elem of values[itemId]) {
                    var sample: IDataItemSample = {
                        value: elem.textContent,
                        sequence: parseInt(elem.getAttribute('sequence')),
                        timestamp: new Date(elem.getAttribute('timestamp'))
                    };
                    if (this._dataItems[itemId] && this._dataItems[itemId].category === 'CONDITION') {
                        sample.condition = elem.tagName;
                    }
                    ret[itemId].push(sample);
                }
            }

            return ret;
        }

        public getDevices = (): angular.IPromise<{ [id: string]: IDataItem }> => {
            return this.$http
                .get(this.baseUrl)
                .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
                .then(result => {
                    this._devicesDocument = result;
                    return this.processDataItems();
                })
                ;
        }

        public getCurrent = (): angular.IPromise<{ [id: string]: IDataItemSample }> => {
            return this.$http
                .get(this.baseUrl + '/current')
                .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
                .then(this.processCurrent)
                ;
        }

        public getSamples = (ids?: string[]): angular.IPromise<{ [id: string]: IDataItemSample[] }> => {
            var url = this.baseUrl + '/sample';
            if (ids) {
                var idString = ids.map(item => '@id="' + item + '"').join(' or ');
                url += '?path=//DataItem[' + idString + ']';
            }

            return this.$http
                .get(url)
                .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
                .then(this.processSamples)
                ;
        }

        public constructor(private $http: angular.IHttpService, private $q: angular.IQService, AGENT_URL: string) {
            this.baseUrl = AGENT_URL;
            this.getDevices();
        }

    }

    MTConnectViewer.app.service('agent', ['$http', '$q', 'AGENT_URL', MTConnectViewer.Agent]);

}