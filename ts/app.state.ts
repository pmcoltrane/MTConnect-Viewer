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
                .state('view-data', {
                    url: '/',
                    templateUrl: 'templates/data.html',
                    controller: 'dataCtrl',
                    controllerAs: 'dataCtrl'
                })
                .state('view-history', {
                    url: '/history/:id',
                    templateUrl: 'templates/history.html',
                    controller: 'historyCtrl',
                    controllerAs: 'historyCtrl'
                })
                ;
        }
        
    }
   
    MTConnectViewer.app.config(['$stateProvider', '$urlRouterProvider', AppState.factory]);
}