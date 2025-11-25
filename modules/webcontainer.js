import { WebContainer } from 'https://esm.sh/@webcontainer/api@1.1.8';
import { state } from './state.js';
import { logToTerminal, els } from './ui.js';

let webContainerInstance;

export async function initWebContainer() {
    if (!window.crossOriginIsolated) {
        logToTerminal('⚠️ Cross-Origin Isolation not enabled. WebContainer cannot start.', 'error');
        logToTerminal('To fix: Hosting on Netlify? Ensure netlify.toml is present.', 'system');
        return;
    }

    try {
        logToTerminal('Booting WebContainer...', 'system');
        webContainerInstance = await WebContainer.boot();
        state.webContainerLoaded = true;
        logToTerminal('WebContainer booted successfully.', 'success');
    } catch (e) {
        logToTerminal(`Failed to boot WebContainer: ${e.message}`, 'error');
        console.error(e);
    }
}

export async function mountFiles() {
    if (!webContainerInstance) return;

    logToTerminal('Mounting files...', 'system');

    const fileSystem = {};
    for (const [filename, fileData] of Object.entries(state.files)) {
        fileSystem[filename] = {
            file: {
                contents: fileData.content
            }
        };
    }

    await webContainerInstance.mount(fileSystem);
    logToTerminal('Files mounted.', 'success');
}

export async function writeFile(filename, content) {
    if (!webContainerInstance) return;
    await webContainerInstance.fs.writeFile(filename, content);
}

export async function startDevServer() {
    if (!webContainerInstance) return;

    logToTerminal('Installing dependencies...', 'system');

    const installProcess = await webContainerInstance.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
        write(data) {
            logToTerminal(data, 'system');
        }
    }));

    if ((await installProcess.exit) !== 0) {
        logToTerminal('Installation failed', 'error');
        return;
    }

    logToTerminal('Starting server...', 'system');
    const startProcess = await webContainerInstance.spawn('npm', ['start']);

    startProcess.output.pipeTo(new WritableStream({
        write(data) {
            logToTerminal(data, 'system');
        }
    }));

    webContainerInstance.on('server-ready', (port, url) => {
        logToTerminal(`Server ready at ${url}`, 'success');
        state.serverUrl = url;
        // Switch preview to server URL
        if (els.previewFrame) {
            els.previewFrame.removeAttribute('srcdoc');
            els.previewFrame.src = url;
        }
    });
}