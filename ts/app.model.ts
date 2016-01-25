/// <reference path="../typings/tsd.d.ts" />
'use strict';

module MTConnectViewer{
    
    export interface IDataItem{
        category:string;
        type:string;
        subType?:string;
        id:string;
        name?:string;
        units?:string;
        
        path:IComponent[];
        value?:any;
        condition?:string;
    }
    
    export interface IComponent{
        type:string;
        id:string;
        name?:string;
    }
    
}