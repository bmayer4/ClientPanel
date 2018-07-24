import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[];
  totalOwed: number;
  loaded: boolean = false;

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.getTotalOwed();
      this.loaded = true;
    }, error => {
      this.loaded = true;
    });
  }

  getTotalOwed() {
    this.totalOwed = this.clients.reduce((sum, value) => {
      return sum + parseFloat(value.balance.toString());
    }, 0);
  }

}
