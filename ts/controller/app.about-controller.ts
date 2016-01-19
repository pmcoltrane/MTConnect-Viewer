/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export class AboutController{
        
        public constructor(){
            console.log("Setup about controller")
        }
    }
    
    AboutController.$inject = [];
    MTConnectViewer.app.controller('aboutCtrl', MTConnectViewer.AboutController);
}