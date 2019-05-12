import React, { ChangeEvent } from 'react';
import Editor from 'react-simple-code-editor';
import './prism.css';
import { highlight, languages } from 'prismjs';
import { Command, Scenario, SideFileData } from './side-file-data';
import 'prismjs/components/prism-java.min';

class App extends React.Component {
  state = {
    code: ''
  };

  handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.target;

    if (!target.files) {
      return;
    }
    const file = target.files.item(0);

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.readAsText( file );

    reader.addEventListener('load', () => {
      if (reader.result) {
        const raw = JSON.parse(reader.result as string);

        const scenarios = raw.tests.map((scenario: any) => {
          const commands = scenario.commands.map((command: any) => {
            let target;

            if (command.targets.length < 1) {
              target = command.target;
            } else {
              target = command.targets.filter((t: string[]) => t[1] === 'css:finder')[0][0].replace('css=', '');
            }

            return new Command(
              command.command,
              target,
              command.value
            )
          });

          return new Scenario(
            scenario.name,
            raw.url,
            commands
          )
        });

        const sideFileData = new SideFileData(
          scenarios
        );

        this.setState({ code: sideFileData.toSelenide() });
      }
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input
            type="file"
            accept="side"
            onChange={(e) => this.handleChangeFile(e)}/>
          <Editor
            value={this.state.code}
            onValueChange={code => this.setState({ code })}
            highlight={code => highlight(code, languages.java, 'java')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </header>
      </div>
    );
  }
}

export default App;
