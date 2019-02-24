// tslint:disable:no-console

export class Logger {
  private sourceName: string;

  constructor(sourceName: string) {
    this.sourceName = sourceName;
  }

  public log(message: string) {
    console.log(`[${this.sourceName}]`, message);
  }
}
