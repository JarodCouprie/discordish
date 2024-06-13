import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-channel-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatError,
  ],
  templateUrl: './channel-dialog.component.html',
  styleUrl: './channel-dialog.component.scss'
})
export class ChannelDialogComponent {
  dialogRef = inject(MatDialogRef<ChannelDialogComponent>)
  formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.formBuilder.group(
    {
      name: ["", [Validators.required]],
    }
  );

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendChannelData() {
    this.dialogRef.close(
      {name: this.form.get("name")?.value}
  )
  }
}
