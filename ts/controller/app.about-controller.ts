/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export class AboutController{
    
        public static factory(){
            return new AboutController();
        }
        
        public constructor(){
            console.log("Setup about controller")
        }
    }
    
    AboutController.factory.$inject = [];
    MTConnectViewer.appModule.controller('aboutCtrl', MTConnectViewer.AboutController.factory)
}