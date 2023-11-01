import { Injectable } from '@angular/core';
import { Task } from '../components/task/models/Task';
import { StoreService } from '@app/shared/services/store.service';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private _storeService: StoreService) { }

  async addTask(userId: string, newTask: Task): Promise<void> {
    try {
      // Obtenemos el usuario
      const user = await this._storeService.getDocument('users', userId);

      if (user) {
        // Agregamos la nueva tarea al arreglo de tareas del usuario
        const updatedTasks = [...user.tasks, newTask];

        // Actualizamos el usuario en Firestore con el nuevo arreglo de tareas
        await this._storeService.updateDocument('users', userId, { tasks: updatedTasks });

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
      const user = await this._storeService.getDocument('users', userId);

      if (user && user.tasks) {
        // Filtramos las tareas del usuario para excluir la tarea que se va a eliminar
        const updatedTasks = user.tasks.filter((task: Task) => task.id !== taskId);

        // Actualizamos el usuario en Firestore con el nuevo arreglo de tareas
        await this._storeService.updateDocument('users', userId, { tasks: updatedTasks });

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

  async getUserTasks(user: User): Promise<any[]> {
    const userDocument = await this._storeService.getDocument('users', user.uid);

    if (userDocument) {
      return userDocument.tasks;
    } else {
      console.error('User document does not exist');
      return [];
    }
  }

  async updateTask(){

  }
}
