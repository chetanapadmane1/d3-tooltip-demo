import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartParentComponent } from './chart-parent/chart-parent.component';
import { ChartComponent } from 'src/app/chart-parent/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartParentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
