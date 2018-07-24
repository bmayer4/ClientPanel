import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Observable<Client[]>;
  client: Observable<Client>;

  constructor(private afs: AngularFirestore) {
    this.clientsCollection =  afs.collection('clients', ref => ref.orderBy('lastName', 'asc'));
   }

   getClients(): Observable<Client[]> {
    //  this.clients = this.clientsCollection.snapshotChanges().pipe(map(changes => {
    //     return changes.map(action => {
    //     const data = action.payload.doc.data() as Client;
    //     data.id = action.payload.doc.id;
    //     return data;
    //   });
    //  }));
    //  return this.clients;
    return this.clientsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
      const data = action.payload.doc.data() as Client;
      data.id = action.payload.doc.id;  //my way
      return data;
    });
   }));
   }

   newClient(client: Client) {
      this.clientsCollection.add(client);
   }

   getClient(id: string): Observable<Client> {
    this.clientDoc = this.afs.doc<Client>(`clients/${id}`);

    return this.clientDoc.snapshotChanges().pipe(map(action => {
      // if (action.payload.exists == false) {
      //   return null  //wouldn't hit error
      // } else {
        const data = action.payload.data() as Client;
        data.id = action.payload.id;
        return data;
      //}  //commented this out to use error in client-details-component.ts
    }));
   }

   updateClient(client: Client) {
     this.clientDoc = this.afs.doc(`clients/${client.id}`);
     this.clientDoc.update(client);
   }

   deleteClient(client: Client) {
    this.clientDoc = this.afs.doc(`clients/${client.id}`);
    this.clientDoc.delete();
  }

}
