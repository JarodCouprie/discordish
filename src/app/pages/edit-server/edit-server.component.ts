import {Component, inject} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-server',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatLabel,
    MatSlideToggle,
    MatButton,
    ReactiveFormsModule,
    MatError,
    MatSnackBarModule,
  ],
  templateUrl: './edit-server.component.html',
  styleUrl: './edit-server.component.scss'
})
export class EditServerComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  snackBar: MatSnackBar = inject(MatSnackBar);
  form: FormGroup = this.formBuilder.group(
    {
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ["", [Validators.maxLength(100)]],
      public: [false, []],
      urlLogo: ["", []]
    }
  );

  addServer() {
    if (this.form.invalid) return;
    this.http.post("http://localhost:3000/server", this.form.value).subscribe(() => {
      this.snackBar.open("Le serveur a bien été ajouté", undefined, {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
      this.router.navigateByUrl("/").then();
    })
  }

  goBack() {
    this.router.navigateByUrl("/").then();
  }
}
