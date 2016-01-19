/// <reference path="../typings/tsd.d.ts" />
'use strict';
declare var X2JS:any;

module MTConnectViewer{
    
    export interface IAgent{
        baseUrl:string;
        devices:angular.IPromise<any>;
    }
    
    export class Agent implements IAgent {
        
        private _x2js:any;
        private _devicesDocument:any;
        private _devicesTimestamp:Date;
        
        
        public baseUrl:string;
        
        public get devices():angular.IPromise<any>{
            if(this._devicesDocument){
                return this.$q.resolve(this._devicesDocument.MTConnectDevices.Devices);
            }
            else{
                return this.getDevices().then(() => this._devicesDocument.MTConnectDevices.Devices);
            }
            
        }
        
        public constructor(private $http:angular.IHttpService, private $q:angular.IQService, AGENT_URL:string){
            this.baseUrl = AGENT_URL;
            this._x2js = new X2JS();
            
            this.getDevices();
        }
        
        private getDevices = () => {
            return this.$http.get(this.baseUrl)
            .then(result => this._x2js.xml_str2json(result.data))
            .then(result => {
                this._devicesDocument = result;
                this._devicesTimestamp = new Date();
                return result;
            });
        }
        
    }
    
    MTConnectViewer.app.service('agent', ['$http', '$q', 'AGENT_URL', MTConnectViewer.Agent]);
    
}