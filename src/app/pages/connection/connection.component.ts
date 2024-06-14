import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-connection',
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
    RouterLink,
  ],
  templateUrl: './connection.component.html',
})
export class ConnectionComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  form: FormGroup = this.formBuilder.group(
    {
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    }
  );

  sendCredentials() {
    if (this.form.invalid) return;
    this.http.post("http://localhost:3000/user/login", this.form.value).subscribe((res: any) => {
      localStorage.setItem("jwt", res.jwt)
      this.router.navigateByUrl("/").then();
    })
  }
}
