import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Server} from "../../models/Server.type";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatSort, MatSortHeader, Sort, SortDirection} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

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
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatSortHeader,
    MatHeaderRow,
    MatRow,
    DatePipe,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatMiniFabButton,
    MatIcon,
  ],
  templateUrl: './edit-server.component.html',
  styleUrl: './edit-server.component.scss'
})
export class EditServerComponent implements OnInit {
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
  servers = new MatTableDataSource<Server>();
  displayedColumns: any = ["urlLogo", "name", "description", "actions"];
  sortField = '';
  sortOrder: SortDirection = 'desc';
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;

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

  ngOnInit(): void {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) return;
    this.http.get<Server[]>("http://localhost:3000/server", {
        headers: {Authorization: `Bearer ${jwt}`}
      }
    ).subscribe(value => {
      this.servers.data = value;
      if (this.sort) {
        this.servers.sort = this.sort
      }
    })
  }

  sortChange($event: Sort) {
    this.sortField = $event.active;
    this.sortOrder = $event.direction;
  }
}
