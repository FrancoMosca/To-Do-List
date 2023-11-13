import { Component } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { AuthService } from '../users/services/auth.service';
import { Task } from './components/task/models/Task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  task1: Task = {
    description: "comprar tomate",
    active: true
  }

  tasks: Task [] = []
  constructor(public auth:AuthService ,public task:TasksService){
    this.task.tasks.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

}
