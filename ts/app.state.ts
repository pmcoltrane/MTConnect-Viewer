/// <reference path="../typings/tsd.d.ts" />

'use strict';

module MTConnectViewer{

    export class AppState {
        
        public static factory($stateProvider, $urlRouterProvider){
            return new AppState($stateProvider, $urlRouterProvider);
        }
        
        public constructor(private $stateProvider, private $urlRouterProvider){
            console.log('Configuring app state');
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'template/home.html',
                    controller: 'homeCtrl',
                    controllerAs: 'homeCtrl'
                })
                ;
        }
        
    }
   
    MTConnectViewer.app.config(['$stateProvider', '$urlRouterProvider', AppState.factory]);
}