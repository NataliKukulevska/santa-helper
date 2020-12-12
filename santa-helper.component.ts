import { Component } from '@angular/core';

export class Child {
  index: number;
  homeX: number;
  homeY: number;
  giftVolume: number;
  toSantaBase: number | null;
  distance: number | null = null;

  constructor(index: number, 
              homeX: number, 
              homeY: number, 
              giftVolume: number, 
              toSantaBase?: number|null, 
              distance?: number|null){
    this.index = index;
    this.homeX  = homeX;
    this.homeY = homeY;
    this.giftVolume = giftVolume;
    this.toSantaBase = toSantaBase;
    this.distance = distance;
  }
}

export class Santa {
  homeX: number;
  homeY: number;
  bagVolume: number;

  constructor(homeX: number, 
              homeY: number, 
              bagVolume: number){
    this.homeX  = homeX;
    this.homeY = homeY;
    this.bagVolume = bagVolume;
  }
}

@Component({
  selector: 'app-santa-helper',
  templateUrl: './santa-helper.component.html',
  styleUrls: ['./santa-helper.component.scss']
})

export class SantaHelperComponent {
  fileToUpload = null;
  fileContent = '';
  context = this;
  numberOfTestCases: number;

  santaBagVolume: number; //available volume

  santaBag: number; // free space in bag
  giftsInBag: Child[] = []; // list of children wich gifts are already in bag 
  
  sortedList: Child[]; // list of children sorted by distance to santaBase

  santaLog: string; // result

  route: {
    input: string | null; 
    length: number | null; 
    output: string | null;
    score: number | null;
  };

  

  //work with input data

  handleFileInput(files: FileList, context): void {
    var file = files.item(0);
    var reader = new FileReader();

    reader.onload = function() {
      context.fileContent = reader.result;
      context.parseInputData();
    }

    reader.readAsText(file);
  }

  parseInputData(): void{
    let dataArray = this.fileContent.split('\n');

    if(dataArray.length){
      this.numberOfTestCases = +dataArray[0];
      dataArray.shift();
      let arrayOfTestCases = this.splitToTestCases(dataArray, this.numberOfTestCases);
      arrayOfTestCases.map((data) => this.setInitData(data))
      console.log('Merry Christmas! HO-HO-HO!!!');
    }
  }

  splitToTestCases(array: string[], numberOfTestCases: number): String[][] {
    let arrayOfTestCases = [];

    for( let i = 0; i < numberOfTestCases; i++){
      let numberOfChildren = array[0].split(' ')[0];
      arrayOfTestCases[i] = array.splice(0, +numberOfChildren + 1);
    }

    return arrayOfTestCases;
  }

  // Init Christmas Day HO-HO-HO

  setInitData(data): void{
    this.route = {
      input: null, 
      length: null, 
      output: null,
      score: null,
    }
  
    this.route.input = data.slice();
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

    this.sortedList = this.sortList(addList.slice(), 'toSantaBase');
    this.santaBagVolume = santa.bagVolume;
    this.santaBag = this.santaBagVolume
    this.santaLog = '';
    this.giftsInBag = [];

    this.loadingSantaBag(); 
  }

  loadingSantaBag(selectedChild?: Child): void{
    if(!selectedChild){
      this.santaBag = this.santaBagVolume;
      selectedChild = this.sortedList[0];
      this.route.length = this.route.length + selectedChild.toSantaBase;
    } else {
      this.route.length = this.route.length + selectedChild.distance;
    };
    this.addToSantaBag(selectedChild);
        
    if (this.santaBag > 0){
      let nextSelectedChild: Child | null = this.findSibling(selectedChild);
        
      if (nextSelectedChild) {
        this.loadingSantaBag(nextSelectedChild)
      } else {
        this.santaGoToBase();
        this.checkList();
      }
    } else {
      this.santaGoToBase();
      this.checkList();
    }
  }

  addToSantaBag(selectedChild: Child): void{
    this.santaBag = this.santaBag - selectedChild.giftVolume;
    this.santaLog = this.santaLog + '-' + selectedChild.index + ' ';
    this.giftsInBag.push(selectedChild);
    this.removeChildFromList(selectedChild);
  }

  removeChildFromList(child: Child): void{
    let childIndex = this.sortedList.findIndex((ch: Child) => { return +ch.index == +child.index });
    this.sortedList.splice(childIndex, 1);
  }

  findSibling(selectedChild: Child): Child | null {
    let list = this.sortedList.filter(child => child.giftVolume <= this.santaBag);

    if (list.length == 0) {
      return null;
    }

    for (let i = 0; i < list.length; i++) {
      list[i].distance = this.countDistance(selectedChild.homeX, selectedChild.homeY, list[i].homeX, list[i].homeY);
    }

    let sortedSiblings = list.length > 1 ? this.sortList(list, 'distance') : list;
    return sortedSiblings[0];
  }

  
  santaGoToBase(){
    for (let i = 0; i < this.giftsInBag.length; i++){
      this.santaLog = this.santaLog + ' ' +this.giftsInBag[i].index + ' ';
    }
    this.route.length = this.route.length + this.giftsInBag[this.giftsInBag.length-1].toSantaBase;
    this.santaBag = 0;
    this.giftsInBag = [];
    
  }

  checkList(): void {
    if (this.sortedList.length > 0) {
      this.loadingSantaBag();
    } else {
      this.santaLog = this.santaLog + '0';
      this.route.output = this.santaLog;
      this.checkScore(this.route);
      console.log(this.route);
    }
  }

  checkScore(route): void {
  }

  sortList(list, property): Child[] {
    return list.sort((a: Child, b: Child): number => { return a[property] > b[property] ? 1 : -1 });
  }

  countDistance(aX: number, aY: number, bX: number, bY: number): number {
    let result = Math.sqrt(Math.pow((aX - bX), 2) + Math.pow((aY - bY), 2));
    return result;
  }
}
