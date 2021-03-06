import {Component} from '@angular/core';
import {FormBuilder, Validators, ControlGroup} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../Services/AuthService';
import {UserAuth} from '../Models/UserAuth';

@Component({
    bindings: [AuthService, FormBuilder],
    template: `
        <form [ngFormModel]="_registrationForm" (submit)="register($event)">
            <input ngControl="login" type="text" placeholder="Login">
            <input ngControl="password" type="password" placeholder="Password">
            <button class="btn btn-success-line" type="submit">Register</button>
            <div>{{ _errorMessage }}</div>
        </form>
    `,
})
//@CanActivate(() => !AuthService.isAuthenticated)
export class RegisterComponent {
    private _registrationForm: ControlGroup;
    private _errorMessage: string;
    private _authService: AuthService;
    private _router: Router;

    constructor(authService: AuthService, router: Router, fb: FormBuilder) {
        this._authService = authService;
        this._router = router;
        this._registrationForm = fb.group({
            login: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        });
    }

    private register(event: Event) {
        const formValues = this._registrationForm.value;

        this._authService.register(new UserAuth(formValues.login, formValues.password)).then(
            v => { this._router.navigateByUrl('/'); },
            err => { this._errorMessage = err.json().message; });
        event.preventDefault();
    }
}
