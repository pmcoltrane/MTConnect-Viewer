/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export class AboutController{
    
        public static factory(){
            return new AboutController();
        }
        
        public constructor(){
            console.log("Setup home controller")
        }
    }
    
    MTConnectViewer.appModule.controller('aboutCtrl', [AboutController.factory])
}