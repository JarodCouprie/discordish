import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {RuleComponent} from "../../components/rule/rule.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    RuleComponent,
    RouterLink
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  snackBar: MatSnackBar = inject(MatSnackBar);
  router: Router = inject(Router);
  form: FormGroup = this.formBuilder.group(
    {
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      firstname: ["", [Validators.required]],
      avatarUrl: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      passwordConfirm: ["", [Validators.required]]
    }
  );
  samePassword: boolean = true;

  verifySamePassword() {
    if (this.form.get('passwordConfirm')?.dirty) {
      this.samePassword = this.form.get("password")?.value === this.form.get("passwordConfirm")?.value;
    }
  }

  sendCredentials() {
    if (this.form.invalid && !this.samePassword) return;
    this.http.post("http://localhost:3000/user/register", this.form.value).subscribe((user) => {
      this.snackBar.open("L'utilisateur a bien été créé", undefined, {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
      this.router.navigateByUrl("/").then();
    })
  }

}
