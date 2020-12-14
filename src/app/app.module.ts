import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SantaHelperComponent } from './santa-helper/santa-helper.component';

@NgModule({
  declarations: [
    AppComponent,
    SantaHelperComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
