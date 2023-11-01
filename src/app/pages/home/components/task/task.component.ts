import { Component, Input, inject } from '@angular/core';
import { Task } from './models/Task';
import { TasksService } from '../../services/tasks.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent{
  @Input() task!: Task;

  public readonly taskSvc = inject(TasksService);

}
