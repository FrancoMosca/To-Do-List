import { Component, inject } from '@angular/core';
import { TasksService } from './services/tasks.service';
import { Task } from './components/task/models/Task';
import { AuthService } from '../users/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user$!:Observable<User | null>;
  tasks: Task[] = [];
  private readonly authSvc = inject(AuthService);
  private readonly taskSvc = inject(TasksService);


  ngOnInit(){
    this.user$ = this.authSvc.userState$;
    this.user$.subscribe(async user => {
      if (user) {
        this.tasks = await this.getTasks(user);
      }
    });
  }

  async getTasks(user: User): Promise<Task[]>{
    console.log(user)
    console.log(this.taskSvc.getUserTasks(user))
    return this.taskSvc.getUserTasks(user);
  }

  async addTask(){
    
  }
}
