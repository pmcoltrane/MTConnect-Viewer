/// <reference path="../typings/tsd.d.ts" />
'use strict';
declare var X2JS:any;

module MTConnectViewer{
    
    export interface IAgent{
        baseUrl:string;
        getDevices():any;
    }
    
    export class Agent implements IAgent {
        
        private x2js:any;
        public baseUrl:string;
        
        
        public constructor(private $http:angular.IHttpService, AGENT_URL:string){
            this.baseUrl = AGENT_URL;
            this.x2js = new X2JS();
            console.log('x2js',this.x2js);
        }
        
        public getDevices = () => {
            return this.$http.get(this.baseUrl)
            .then(result => this.x2js.xml_str2json(result.data));
        }
        
    }
    
    MTConnectViewer.app.service('agent', ['$http', 'AGENT_URL', MTConnectViewer.Agent]);
    
}