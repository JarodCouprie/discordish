import {Component, inject, OnInit} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {MatTooltip} from "@angular/material/tooltip";
import {Server} from "../../models/Server.type";
import {Message} from "../../models/Message.type";
import {Channel} from "../../models/Channel.type";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {ChannelDialogComponent} from "./channel-dialog/channel-dialog.component";
import {DatePipe, TitleCasePipe} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../models/User.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon, MatIconModule, RouterLink, MatTooltip, MatButton, TitleCasePipe, DatePipe, MatError, MatFormField, MatInput, MatLabel, ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  http = inject(HttpClient);
  dialog: MatDialog = inject(MatDialog);
  servers: Server[] = [];
  messages: Message[] = [];
  channels: Channel[] = [];
  users: User[] = [];
  snackBar: MatSnackBar = inject(MatSnackBar);
  formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.formBuilder.group(
    {
      message: ["", []],
    }
  );
  serverClicked: Server = {
    _id: "",
    name: "",
    urlLogo: "",
    public: false,
    description: ""
  };
  channelClicked: Channel = {
    _id: "",
    name: "",
    serverId: "",
  };

  ngOnInit(): void {
    this.getServerOwnByUser();
  }

  getServerOwnByUser() {
    this.http.get<Server[]>("http://localhost:3000/server/own"
    ).subscribe(servers => {
      this.servers = servers;
      if (servers.length > 0) {
        this.serverClicked = servers[0];
        this.onServerClick(this.serverClicked);
        this.getUserFromServer(this.serverClicked._id);
      }
    })
  }

  getUserFromServer(serverId: string) {
    this.http.get<User[]>(`http://localhost:3000/user/server/${serverId}`).subscribe((users) => {
      if (users.length > 0) {
        this.users = users;
      }
    })
  }

  onServerClick(server: Server) {
    this.serverClicked = server;
    this.http.get<Channel[]>(`http://localhost:3000/channel/getByServerId/${server._id}`
    ).subscribe(channels => {
      this.channels = [];
      this.messages = [];
      this.channels = channels;
      if (this.channels.length > 0) {
        this.channelClicked = this.channels[0];
        this.onChannelClick(this.channelClicked);
      }
      this.getUserFromServer(this.serverClicked._id);
    })
  }

  onChannelClick(channel: Channel) {
    this.channelClicked = channel;
    this.getMessagesFromChannel(channel._id);
  }

  getMessagesFromChannel(channelId: string) {
    this.http.get<Message[]>(`http://localhost:3000/message/getByChannelId/${channelId}`).subscribe(
      messages => {
        this.messages = messages.reverse();
      }
    )
  }

  openNewChannelDialog() {
    const dialogRef = this.dialog.open(ChannelDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newChannel = {
          name: result.name,
          serverId: this.serverClicked._id
        }
        this.http.post(`http://localhost:3000/channel`, newChannel).subscribe(() => {
          this.onServerClick(this.serverClicked);
        })
      }
    });
  }

  sendMessage() {
    const messageValue = this.form.get("message")?.value;
    if (!messageValue) return;
    const channelId = this.channelClicked._id;
    const newMessage = {
      content: messageValue,
      channelId: channelId
    };
    this.http.post("http://localhost:3000/message", newMessage).subscribe(() => {
      this.getMessagesFromChannel(channelId);
      this.form.reset();
    });
  }

  block(userId: string) {
    this.http.put<HttpResponse<any>>(`http://localhost:3000/server/block/${this.serverClicked._id}`, {userId}).subscribe(
      {
        next: () => {
          return this.snackBar.open("L'utilisateur a été bloqué", undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top"
          });
        },
        error: err => {
          if (err.status === 200) return;
          return this.snackBar.open("Erreur lors du blocage de l'utilisateur", undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      }
    );
  }

  unblock(userId: string) {
    this.http.put<HttpResponse<any>>(`http://localhost:3000/server/unblock/${this.serverClicked._id}`, {userId}).subscribe(
      {
        next: () => {
          return this.snackBar.open("L'utilisateur a été débloqué", undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top"
          });
        },
        error: err => {
          if (err.status === 200) return;
          return this.snackBar.open("Erreur lors du déblocage de l'utilisateur", undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      }
    );
  }
}
