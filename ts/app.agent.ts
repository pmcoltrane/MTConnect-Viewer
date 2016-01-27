/// <reference path="../typings/tsd.d.ts" />
'use strict';
declare var X2JS:any;

module MTConnectViewer{
    
    export interface IAgent{
        baseUrl:string;
        devices:() => angular.IPromise<XMLDocument>;
        current:() => angular.IPromise<XMLDocument>;
        sample:(ids:string[]) => angular.IPromise<XMLDocument>;
    }
    
    export class Agent implements IAgent {
        
        private _domParser:DOMParser = new DOMParser();
        private _devicesDocument:XMLDocument;
        private _devicesTimestamp:Date;
        
        
        public baseUrl:string;
        
        public devices = ():angular.IPromise<XMLDocument> => {
            if(this._devicesDocument){
                return this.$q.resolve(this._devicesDocument);
            }
            else{
                return this.getDevices().then(() => this._devicesDocument);
            }   
        }
        
        public current = ():angular.IPromise<XMLDocument> => {
            return this.$http.get(this.baseUrl + '/current')
            .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
            ;
        }
        
        public sample = (ids:string[]):angular.IPromise<XMLDocument> => {
            var idString = ids.map(item => '@id="' + item + '"').join(' or ');
            return this.$http.get(this.baseUrl + '/sample?path=//DataItem[' + idString + ']')
            .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
            ;
        }
        
        public constructor(private $http:angular.IHttpService, private $q:angular.IQService, AGENT_URL:string){
            this.baseUrl = AGENT_URL;
            this.getDevices();
        }
        
        private getDevices = () => {
            return this.$http.get(this.baseUrl)
            .then(result => this._domParser.parseFromString(<string>result.data, 'application/xml'))
            .then(result => {
                this._devicesDocument = result;
                this._devicesTimestamp = new Date();
                return result;
            });
        }
        
    }
    
    MTConnectViewer.app.service('agent', ['$http', '$q', 'AGENT_URL', MTConnectViewer.Agent]);
    
}