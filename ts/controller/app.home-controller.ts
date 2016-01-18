/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export class HomeController{
    
        public static factory(){
            return new HomeController();
        }
        
        public constructor(){
            console.log("Setup home controller")
        }
    }
    
    MTConnectViewer.appModule.controller('homeCtrl', [HomeController.factory])
}