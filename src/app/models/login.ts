export class Login {
    constructor(
      public username: string,
      public password: string
    ) {}

    isValid(): boolean {
      return !!(this.username && this.password);
    }
  }