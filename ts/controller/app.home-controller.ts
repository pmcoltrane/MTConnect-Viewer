/// <reference path="../../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export class HomeController{
    
        public static factory($state){
            return new HomeController($state);
        }
        
        public constructor(private $state){
            console.log("Setup home controller");
            console.log($state);
        }
    }
    
    HomeController.factory.$inject = ['$state'];
    MTConnectViewer.appModule.controller('homeCtrl', MTConnectViewer.HomeController.factory)
}