const TAB = '\t';
const NEW_LINE = '\n';

export class SideFileData {
  constructor(
    public scenarios: Scenario[],
  ) {}

  public toSelenide(): string {
    return this.scenarios.map(scenario => scenario.toSelenide()).join(NEW_LINE);
  }
}

export class Scenario {
  constructor(
    public name: string,
    public host: string,
    public commands: Command[]
  ) {}

  public toSelenide(): string {
    let resultSourceCode = `public class ${this.name} {${NEW_LINE}`;

    resultSourceCode += `${TAB}public void exec() {${NEW_LINE}`;

    resultSourceCode += this.commands.map(command =>
      command.toSelenide(this.host)
    ).join('');

    resultSourceCode += `${TAB}}${NEW_LINE}}`;

    return resultSourceCode;
  }
}

export class Command {
  constructor(
    public commandType: string,
    public target: string,
    public value?: string,
  ) {}

  public toSelenide(host: string): string {
    switch(this.commandType) {
      case 'open':
        return `${TAB}${TAB}Selenide.open("${host}${this.target}");${NEW_LINE}`;
      case 'click':
        return `${TAB}${TAB}$("${this.target}").click();${NEW_LINE}`;
      case 'type':
        return `${TAB}${TAB}$("${this.target}").val("${this.value}");${NEW_LINE}`;
      default:
        return '';
    }
  }
}
