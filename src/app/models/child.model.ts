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