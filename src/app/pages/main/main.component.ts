import {Component, inject, OnInit} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
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
    this.http.get<Server[]>("http://localhost:3000/server/own"
    ).subscribe(value => {
      this.servers = value;
      if (this.servers.length) {
        this.serverClicked = this.servers[0]
        this.onServerClick(this.serverClicked);
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
}
