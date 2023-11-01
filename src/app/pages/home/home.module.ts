import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TaskComponent } from './components/task/task.component';


@NgModule({
  declarations: [
    HomeComponent,
    SearchBarComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
