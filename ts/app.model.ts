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
        
        current?:IDataItemSample;
        samples?:IDataItemSample[];
    }
    
    export interface IDataItemSample{
        value?:any;
        condition?:string;
        sequence?:number;
        timestamp?:Date;
    }
    
    export interface IComponent{
        type:string;
        id:string;
        name?:string;
    }
    
}