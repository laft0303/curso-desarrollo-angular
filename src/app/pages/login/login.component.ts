import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from './../../services/storage.service';
import { ApiService } from './../../services/api.service';
import { Login } from './../../models/login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hasError: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.hasError = false;
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  isValid(field: string): boolean {
    const f = this.form.get(field);
    return f.invalid && (f.dirty || f.touched);
  }

  login() {
    if (this.form.valid) {

      const login = new Login(
        this.form.get('username').value,
        this.form.get('password').value,
      );

      if (login.isValid()) {
        this.api.auth(login).subscribe( user => {
          this.storage.create('_user', user);
        }, ({ error }) => {
          if (error) {
            this.hasError = true;
            this.errorMessage = error.error;
            setTimeout(() => {
              this.hasError = false;
              this.errorMessage = '';
            }, 3000);
          }
        });
      }
    }
  }

}
