// Importamos las dependencias necesarias
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';

// Usamos el decorador Injectable para indicar que este servicio puede ser inyectado en otros componentes o servicios
@Injectable({
  providedIn: 'root'  // Indica que este servicio está disponible en toda la aplicación
})
export class StoreService {
  
  constructor(private store: Firestore) { }

  // Método para agregar un documento a una colección específica
  async addDocument(collectionName: string, data: any, id?: string): Promise<void> {
    try {
      const docRef = id ? doc(this.store, collectionName, id) : doc(collection(this.store, collectionName));
      await setDoc(docRef, data);
      console.log('Documento agregado exitosamente', 'Acción exitosa');
    } catch (error) {
      console.error('Ocurrió un error al agregar el documento: ' + error, 'Error');
    }
  }

  // Método para actualizar un documento específico en una colección
  async updateDocument(collectionName: string, documentId: string, newData: any) {
    try {
      // Obtenemos la referencia al documento que queremos actualizar
      const docRef = doc(this.store, collectionName, documentId);
      console.log(newData);
      // Actualizamos el documento con los nuevos datos
      await updateDoc(docRef, newData);
      console.log(docRef)
      console.log('Documento actualizado exitosamente', 'Acción exitosa');
    } catch (error) {
      console.error('Error al actualizar el documento: ' + error, 'Error');
    }
  }

  // Método para obtener todos los documentos de una colección
  async getDocuments(collectionName: string): Promise<any[]> {
    // Obtenemos un snapshot de la consulta a la colección
    const querySnapshot = await getDocs(collection(this.store, collectionName));
    // Creamos un array para almacenar los documentos
    const documentsArray: any[] = [];

    // Iteramos sobre cada documento en el snapshot
    querySnapshot.forEach((doc) => {
      // Obtenemos el ID del documento
      const documentId = doc.id;
      // Obtenemos los datos del documento
      const documentData = doc.data();
      // Creamos un objeto que contiene el ID y los datos del documento
      const document = { id: documentId, ...documentData };
      // Agregamos el objeto al array
      documentsArray.push(document);
    });

    // Devolvemos el array de documentos
    return documentsArray;
  }

  // Método para verificar si un documento existe en una colección
  async documentExists(collectionName: string, documentId: string): Promise<boolean> {
    const docRef = doc(this.store, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  // Método para obtener un documento específico de una colección
  async getDocument(collectionName: string, documentId: string): Promise<any> {
    const docRef = doc(this.store, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No such document!');
      return null;
    }
  }
}