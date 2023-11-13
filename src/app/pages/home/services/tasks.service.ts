import { Injectable } from '@angular/core';
import { Task } from '../components/task/models/Task';
import { StoreService } from '@app/shared/services/store.service';
import { AuthService } from '@app/pages/users/services/auth.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public userId!: string;

  constructor(private store: StoreService, private auth: AuthService){
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.getUserTasks(user.uid);
      }
    });
  }

  async addTask(userId: string, newTask: Task): Promise<void> {
    try {
      // Obtenemos el usuario
      const user = await this.store.getDocument('users', userId);

      newTask.id = user.tasks.length + 1;

      if (user) {
        // Agregamos la nueva tarea al arreglo de tareas del usuario
        const updatedTasks = [...user.tasks, newTask];

        // Actualizamos el usuario en Firestore con el nuevo arreglo de tareas
        await this.store.updateDocument('users', userId, { tasks: updatedTasks });

        console.log('Task added successfully');
      } else {
        console.error('No such user!');
      }
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      // Obtenemos el usuario
      const user = await this.store.getDocument('users', userId);

      if (user && user.tasks) {
        // Filtramos las tareas del usuario para excluir la tarea que se va a eliminar
        const updatedTasks = user.tasks.filter((task: Task) => task.id !== taskId);

        // Actualizamos el usuario en Firestore con el nuevo arreglo de tareas
        await this.store.updateDocument('users', userId, { tasks: updatedTasks });

        console.log('Task deleted successfully');
      } else {
        console.error('No such user or task!');
      }
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  }

  async getTaskById(){

  }

  // async getUserTasks(userId: string): Promise<Task[]> {
  //   const userDocument = await this.store.getDocument('users', userId);

  //   if (userDocument) {
  //     return userDocument.tasks;
  //   } else {
  //     console.error('User document does not exist');
  //     return [];
  //   }
  // }
  getUserTasks(userId: string): void {
    this.store.getDocument('users', userId).then((userDocument:any) => {
      if (userDocument && userDocument.tasks) {
        this.tasks.next(userDocument.tasks);
      } else {
        console.error('User document does not exist');
        this.tasks.next([]);
      }
    });
  }
  
  async updateTask(task: Task){
    console.log(task.id)
    const data = {
      description: task.description,
      active: false
    }
    this.store.updateDocument('users',this.userId,data);
  }
}
