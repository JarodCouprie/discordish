import {Component, inject, OnInit} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatTooltip} from "@angular/material/tooltip";
import {Server} from "../../models/Server.type";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon, MatIconModule, RouterLink, MatTooltip
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  http = inject(HttpClient);
  servers: Server[] = [];

  ngOnInit(): void {
    this.http.get<Server[]>("http://localhost:3000/server").subscribe(value => {
      this.servers = value;
    })
  }

}
