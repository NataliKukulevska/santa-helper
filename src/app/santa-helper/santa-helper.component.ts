import { Component } from '@angular/core';
import { Child } from '../models/child.model';
import { Santa } from '../models/santa.model';
import { TestCaseSummary } from '../models/testCase.model';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'mc-santa-helper',
  templateUrl: './santa-helper.component.html',
  styleUrls: ['./santa-helper.component.scss']
})

export class SantaHelperComponent {
  fileToUpload = null;
  fileContent = '';
  context = this;

  numberOfTestCases: number;
  testCaseSummary: TestCaseSummary;
  routes: TestCaseSummary[] = [];

  santaBagVolume: number; //available volume
  santaBag: number; // free space in bag
  giftsInBag: Child[] = []; // list of children wich gifts are already in bag 
  sortedList: Child[]; // list of children sorted by distance to santaBase
  santaLog: string; // route

  //work with input data

  handleFileInput(files: FileList, context): void {
    if (files && files.item(0)){
      var file = files.item(0);
      var reader = new FileReader();

      reader.onload = function() {
        context.fileContent = reader.result;
        context.parseInputData();
      }

      reader.readAsText(file);
    }
  }

  parseInputData(): void{
    let dataArray = this.fileContent.split('\n');

    if(dataArray.length){
      this.numberOfTestCases = +dataArray[0];
      dataArray.shift();
      let arrayOfTestCases = this.splitToTestCases(dataArray, this.numberOfTestCases);
      arrayOfTestCases.map((data) => this.setInitData(data));
      console.log(this.routes);
      console.log('Merry Christmas! HO-HO-HO!!!');
    }
      
  }

  splitToTestCases(array: string[], numberOfTestCases: number): string[][] {
    let arrayOfTestCases = [];

    for( let i = 0; i < numberOfTestCases; i++){
      let numberOfChildren = array[0].split(' ')[0];
      arrayOfTestCases[i] = array.splice(0, +numberOfChildren + 1);
    }

    return arrayOfTestCases;
  }

  // Init Christmas Day HO-HO-HO

  setInitData(data: string[]): void{
    this.testCaseSummary = {
      input: null, 
      length: null, 
      output: '',
      score: null,
    }
  
    this.testCaseSummary.input = data.slice();

    let definition = data.shift();
    let definitionArray = definition.split(' ');

    //santa data
    let santa = new Santa(+definitionArray[1], +definitionArray[2], +definitionArray[3]);

    //create children list and count distance from childHouse to santaBase
    let numberOfChildren = +definitionArray[0];
    let addList = [];

    for (let i = 0; i < numberOfChildren; i++){
      let childDataArray = data[i].split(' ');
      let child = new Child(i+1, +childDataArray[0], +childDataArray[1], +childDataArray[2]);
      child.toSantaBase = this.countDistance(child.homeX, child.homeY, santa.homeX, santa.homeY);
      addList.push(child);
    }

    this.sortedList = this.sortList(addList.slice(), 'toSantaBase', 'desc');
    this.santaBagVolume = santa.bagVolume;
    this.santaBag = this.santaBagVolume;
    this.giftsInBag = [];

    this.loadingSantaBag(); 
  }

  loadingSantaBag(selectedChild?: Child, santaBag?: number): void{
    if(!selectedChild){
      santaBag = this.santaBagVolume;
      selectedChild = this.sortedList[0];
      this.testCaseSummary.length = this.testCaseSummary.length + selectedChild.toSantaBase;
    } else {
      this.testCaseSummary.length = this.testCaseSummary.length + selectedChild.distance;
    };
    santaBag = this.addToSantaBag(selectedChild, santaBag);
        
    if (santaBag > 0){
      let nextSelectedChild: Child | null = this.findNeighbor(selectedChild, santaBag);
        
      if (nextSelectedChild) {
        this.loadingSantaBag(nextSelectedChild, santaBag)
      } else {
        this.santaGoToBase();
      }
    } else {
      this.santaGoToBase();
    }
  }

  finishTestCase(): void{
    this.testCaseSummary.output = this.testCaseSummary.output + '0';
    this.routes.push(this.testCaseSummary);
  }

  addToSantaBag(selectedChild: Child, santaBag: number): number{
    santaBag = santaBag - selectedChild.giftVolume;
    this.testCaseSummary.output = this.testCaseSummary.output + '-' + selectedChild.index + ' ';
    this.giftsInBag.push(selectedChild);
    this.removeChildFromList(selectedChild);
    return santaBag;
  }

  removeChildFromList(child: Child): void{
    let childIndex = this.sortedList.findIndex((ch: Child) => { return +ch.index == +child.index });
    this.sortedList.splice(childIndex, 1);
  }

  findNeighbor(selectedChild: Child, santaBag: number): Child | null {
    let list = this.sortedList.filter(child => child.giftVolume <= santaBag);

    if (list.length == 0) {
      return null;
    }

    for (let i = 0; i < list.length; i++) {
      list[i].distance = this.countDistance(selectedChild.homeX, selectedChild.homeY, list[i].homeX, list[i].homeY);
    }

    let sortedNeighbors = list.length > 1 ? this.sortList(list, 'distance+wayToSanta') : list;
    return sortedNeighbors[0];
  }

  
  santaGoToBase(): void{
    for (let i = 0; i < this.giftsInBag.length; i++){
      this.testCaseSummary.output = this.testCaseSummary.output + ' ' +this.giftsInBag[i].index + ' ';
    }
    this.testCaseSummary.length = this.testCaseSummary.length + this.giftsInBag[this.giftsInBag.length-1].toSantaBase;
    this.giftsInBag = [];

    if(this.sortedList.length > 0){
      this.loadingSantaBag();
    } else {
      this.finishTestCase();
    }
  }

  sortList(list: Child[], property: string, type?): Child[] {
    if (type == 'desc'){return list.sort((a: Child, b: Child): number => { return a[property] > b[property] ? -1 : 1 });}

    if (property == 'distance+wayToSanta'){
      return list.sort((a: Child, b: Child): number => { 
        return ((a.distance + a.toSantaBase) > (b.distance + b.toSantaBase)) ? 1 : -1 });}
    
    return list.sort((a: Child, b: Child): number => { return a[property] > b[property] ? 1 : -1 });
  }

  countDistance(aX: number, aY: number, bX: number, bY: number): number {
    let result = Math.sqrt(Math.pow((aX - bX), 2) + Math.pow((aY - bY), 2));
    return result;
  }
}
