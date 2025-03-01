const vscode = require("vscode");
const Server = require("./library/server.js")
const Client = require("./library/client.js")
/**
 * @param {vscode.ExtensionContext} context
 */

let server;
let client;
let validArray = [];
function activate(context) {
  //   let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  //   statusBarItem.text = "$(zap) Dev Connect";
  //   statusBarItem.tooltip = "Start Dev Connect Extension";
  //   statusBarItem.command = "dev-connect.start-dev-connect";
  //   statusBarItem.show();

  //   context.subscriptions.push(statusBarItem);

  const treeDataProvider = new DevConnectViewProvider();
  vscode.window.registerTreeDataProvider("devConnectView", treeDataProvider);

  let disposable = vscode.commands.registerCommand(
    "dev-connect.start-dev-connect",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "devConnect",
        "Dev Connet",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "setConnector") {
            const feHost = message.feHost;
            const fePort = message.fePort;
            const bePort = message.bePort;
            const dbPort = message.dbPort;
            const beHost = message.beHost;
            const dbHost = message.dbHost;
            const otherPort = message.otherPort;
            const otherHost = message.otherHost;
            const connector = message.connectorName;
            const array = [
              { port: fePort, host: feHost, connector: connector + fePort },
              { port: bePort, host: beHost, connector: connector + bePort },
              { port: dbPort, host: dbHost, connector: connector + dbPort },
              { port: otherPort, host: otherHost, connector: connector + otherPort},
            ];
        
             validArray = array
            .filter((service) => service.port && service.host)
            .map((service) => ({
              port: service.port,
              host: service.host,
              connector: connector + service.port,
            }));
            validArray.forEach((item) => {
               server = new Server(item)
              server.start()
            });
          }

         
        },
        undefined,
        context.subscriptions
      );
    }
  );
  context.subscriptions.push(disposable);

  let disposable1 = vscode.commands.registerCommand(
    "dev-connect.start-dev-connect_connect",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "devConnectconnector",
        "Dev Connect Connector",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
  
      panel.webview.html = getWebviewContent1();
  
     panel.webview.onDidReceiveMessage(
  async (message) => {
    if (message.command === "getConnector") {
    let   NewconnectorString = message.connectorString
      function parseConnectorString(NewconnectorString) {
        const parts = NewconnectorString.split("-");
        const connectorName = parts[0]; // Extract 'my-connector'
        const services = parts.slice(1); // Extract the service mappings
        const result = [];
      
        services.forEach((service) => {
          const match = service.match(/(\w+)=([^:]+):(\d+)/);
          if (match) {
            const [, serviceName, host, port] = match;
            result.push({
              port,
              host,
              connector: `${connectorName}${port}`,
            });
          }
        });
        console.log("result", result)
        return result;
      }
      
     
      const newarray = parseConnectorString(NewconnectorString);
      newarray.forEach((item) => {
        const client = new Client(item.connector, item)
        client.start()
    
      });
    }
  },
  undefined,
  context.subscriptions
);

    }
  );
  context.subscriptions.push(disposable1);
  
  let stopCommand = vscode.commands.registerCommand(
    "dev-connect.stop-dev-connect",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "devConnect",
        "Dev Connet",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      validArray.forEach((item) => {
         server.destroy()
            });
    }
  );
  context.subscriptions.push(stopCommand);
  let disconnectCommand = vscode.commands.registerCommand(
    "dev-connect.disconnect-dev-connect",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "devConnect",
        "Dev Connet",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      validArray.forEach((item) => {
        process.exit(2)
      });
    }
  );
  context.subscriptions.push(disconnectCommand);
}

class DevConnectViewProvider {
  constructor(context) {
    this.context = context;
  }
  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return [
      this.createOpenDevConnectItem(),
      this.createOpenDevConnectStopItem(),
      this.createOpenDevConnect_connectItem(),
      this.createOpenDevDisconnectItem(),
    ];
  }
  createOpenDevConnectItem() {
    const item = new vscode.TreeItem(
      " Start Sharing",
      vscode.TreeItemCollapsibleState.None
    );
    item.iconPath = new vscode.ThemeIcon("cloud-upload"); // Built-in icon
    item.command = {
      command: "dev-connect.start-dev-connect",
      title: "Dev Connect",
    };
    return item;
  }
  
  createOpenDevConnect_connectItem() {
    const item = new vscode.TreeItem(
      "Connect",
      vscode.TreeItemCollapsibleState.None
    );
    item.iconPath = new vscode.ThemeIcon("plug"); // Built-in icon
    item.command = {
      command: "dev-connect.start-dev-connect_connect",
      title: "Dev Connect Connect",
    };
    return item;
  }
  
  createOpenDevConnectStopItem() {
    const item = new vscode.TreeItem(
      "Stop Sharing",
      vscode.TreeItemCollapsibleState.None
    );
    item.iconPath = new vscode.ThemeIcon("stop"); // Built-in icon
    item.command = {
      command: "dev-connect.stop-dev-connect",
      title: "Stop Dev Connect",
    };
    return item;
  }


  createOpenDevDisconnectItem() {
    const item = new vscode.TreeItem(
      "Disconnect",
      vscode.TreeItemCollapsibleState.None
    );
    item.iconPath = new vscode.ThemeIcon("stop"); // Built-in icon
    item.command = {
      command: "dev-connect.disconnect-dev-connect",
      title: "Disconnect Dev Connect",
    };
    return item;
  }
  
}



function getWebviewContent() {
  return require("fs").readFileSync(__dirname + "/webview.html", "utf8");
}

function getWebviewContent1() {
  return require("fs").readFileSync(__dirname + "/connect.html", "utf8");
}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
