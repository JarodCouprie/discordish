import {Routes} from '@angular/router';
import {ConnectionComponent} from "./pages/connection/connection.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {MainComponent} from "./pages/main/main.component";
import {EditServerComponent} from "./pages/edit-server/edit-server.component";
import {RegisterComponent} from "./pages/register/register.component";
import {userGuard} from "./guards/user.guard";

export const routes: Routes = [
  {
    path: "login", component: ConnectionComponent,
  },
  {
    path: "profile", component: ProfileComponent, canActivate: [userGuard]
  },
  {
    path: "main", component: MainComponent, canActivate: [userGuard]
  },
  {
    path: "register", component: RegisterComponent
  },
  {
    path: "add-server", component: EditServerComponent, canActivate: [userGuard]
  },
  {
    path: "", redirectTo: "main", pathMatch: "full"
  },
  {
    path: "**", component: NotFoundComponent
  },
];
