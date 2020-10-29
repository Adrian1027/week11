// import { Component } from "@angular/core";
// import * as io from "socket.io-client";

// @Component({
//   selector: "app-root",
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"],
// })
// export class AppComponent {
//   title="w11app";
//   socket: SocketIOClient.Socket;
//   number1=0;
//   number2=0;
//   result=0
//   constructor() {
//     this.socket = io.connect("http://192.168.0.3:8080");
//   }
//   ngOnInit() {
//     this.socket.on("newResult",(data)=>{
// this.result=data.value

//     })
//   }
  
//   newSocketID(){
//     let pay={no1:this.number1,  no2:this.number2};
//     this.socket.emit('newOp', pay);
//   }
// }
import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  socket: SocketIOClient.Socket;
  pollObj={question:"",options:[]};

  vote:number;
  error:String="";

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [1,1,1,1,1,1,1,1];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [
    ];


  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.socket = io.connect();
  }
  ngOnInit() {
    console.log("Be called");
    this.listenNewConnet();
    this.listenNewVote();
    
  }
  //listen the new connetion 
  listenNewConnet(){
    this.socket.on("newCon",data=>{
      this.label(data);
      this.setvote(data);
      this.pollObj =data;
    })
    
  }
  sendVote(){
      this.socket.emit("newVote",{vote:this.vote})
  }
  listenNewVote(){
    this.socket.on("vote",data=>{
      this.label(data);
      this.setvote(data);
      this.pollObj=data;
      console.log(this.pieChartData);
      console.log(this.pieChartLabels);
    })

  }
  label(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].text)
    }
    this.pieChartLabels =  arr;
  }
  setvote(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].count); 
    }
    this.pieChartData = arr;
  }

}