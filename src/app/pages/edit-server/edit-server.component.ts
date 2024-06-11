import {Component, inject} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton} from "@angular/material/button";

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
  ],
  templateUrl: './edit-server.component.html',
  styleUrl: './edit-server.component.scss'
})
export class EditServerComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.formBuilder.group(
    {
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ["", [Validators.maxLength(100)]],
      public: [false, []]
    }
  );

  addServer() {
    console.log(this.form.value);
    if (this.form.invalid) return;
  }
}
