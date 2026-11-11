# Dev Connect

**Instantly share your localhost website with anyone in the world and see what your friends are building.**

Dev Connect is a Visual Studio Code extension that exposes local services (frontend, backend, database or any other host:port) to peers over a peer-to-peer network using [Holesail](https://www.npmjs.com/package/holesail), and lets you connect to a peer's shared services using a connection key. There is no central server to configure.

## Features

- **Expose your localhost on the internet** from inside VS Code
- **Connect to anyone's localhost** through a connection key
- **Multiport support** – share up to four services at once (Frontend, Backend, Database and one "Other" service), each with its own host and port
- **Peer-to-peer** – connections are made through Holesail (built on the Hyperswarm / HyperDHT stack) rather than a central relay
- **Future goal:** restrict the number of peers that can connect

## How It Works

After installation, a **Dev Connect** icon appears in the VS Code Activity Bar. The **Dev Connect Panel** offers four options:

1. **Start Sharing** – opens a form where you enter host/port pairs for the services you want to share and a connector name. Dev Connect starts a Holesail server for each service and generates a connector string you can copy and send to a peer.
2. **Stop Sharing** – stops the running share.
3. **Connect** – paste a connector string received from a peer. Dev Connect starts a Holesail client for each service in the string so the peer's services become reachable on your machine.
4. **Disconnect** – disconnects from the peer's services.

The connector string has the form `<connector-name>-<service>=<host>:<port>-...`, and each service is keyed by the connector name plus its port.

## UI Preview

### UI for Sharing
![Start Sharing](./Dev-Share.png)

### UI for connecting
![Connect](./Dev-Connect.png)

### UI of Options
![Options](./Dev-Options.png)

### UI of Extension
![Extension](./Dev-Rename.png)

## Tech Stack

- **VS Code Extension API** (requires VS Code `^1.97.0`)
- **Node.js** (CommonJS)
- **Holesail** (`holesail`, `holesail-server`, `holesail-client`) for peer-to-peer tunnelling
- **HTML, CSS, JavaScript** webviews (`webview.html` for sharing, `connect.html` for connecting)

## Project Structure

```
extension.js        # Extension entry point: commands, webviews, Activity Bar tree view
library/server.js   # Wrapper around holesail-server (sharing side)
library/client.js   # Wrapper around holesail-client (connecting side)
webview.html        # "Start Sharing" form
connect.html        # "Connect" form
test/               # Extension tests (run with @vscode/test-cli)
```

## Development Setup

Prerequisites: Node.js and VS Code.

```bash
git clone https://github.com/utkarshpayal/dev-connect.git
cd dev-connect
npm install
```

To run the extension locally, open the folder in VS Code and press `F5` (the **Run Extension** launch configuration). This opens an Extension Development Host window with Dev Connect loaded.

### Scripts

| Command        | Description                                         |
| -------------- | --------------------------------------------------- |
| `npm run lint` | Run ESLint over the project                          |
| `npm test`     | Run lint, then the extension tests via `vscode-test` |

## Configuration

No environment variables or extension settings are required. All hosts, ports and connector names are entered through the extension's webview forms.

## Future Enhancements

- Implementing peer connection restrictions
- Enhanced security measures
- UI/UX improvements

## License

The previous README referred to the MIT License, but the repository does not contain a `LICENSE` file (needs confirmation).
