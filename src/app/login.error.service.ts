import { Injectable } from '@angular/core';

@Injectable()
export class LoginError {
	constructor(){}
	public enteredUsername: string
	public enteredEmail: string
	public enteredPassword: string
	public errorMessage: string
}
