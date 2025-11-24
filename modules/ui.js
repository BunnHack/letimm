import { state } from './state.js';

export const els = {
    get sidebar() { return document.getElementById('sidebar'); },
    get sidebarToggle() { return document.getElementById('sidebar-toggle'); },
    get emptyState() { return document.getElementById('empty-state'); },
    get projectView() { return document.getElementById('project-view'); },
    get initialInput() { return document.getElementById('initial-input'); },
    get initialSendBtn() { return document.getElementById('initial-send-btn'); },
    get chatInput() { return document.getElementById('chat-input'); },
    get chatSendBtn() { return document.getElementById('chat-send-btn'); },
    get messagesContainer() { return document.getElementById('messages-container'); },
    get previewFrame() { return document.getElementById('preview-frame'); },
    get codeView() { return document.getElementById('code-view'); },
    get terminalView() { return document.getElementById('terminal-view'); },
    get terminalOutput() { return document.getElementById('terminal-output'); },
    get codeEditorMount() { return document.getElementById('code-editor-mount'); },
    get fileList() { return document.getElementById('file-list'); },
    get statusIndicator() { return document.getElementById('status-indicator'); },
    get suggestions() { return document.querySelectorAll('.pill'); },
    get tabs() { return document.querySelectorAll('.tab'); },
    get historyBtn() { return document.getElementById('history-btn'); }
};

const successAudio = new Audio('success_chime.mp3');

export function playSuccessSound() {
    successAudio.play().catch(() => {});
}

export function addMessage(role, text) {
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.id = id;
    div.innerHTML = `<div class=\"msg-content\">${escapeHtml(text)}</div>`;
    els.messagesContainer.appendChild(div);
    els.messagesContainer.scrollTop = els.messagesContainer.scrollHeight;
    return id;
}

export function updateStatus(thinking) {
    if (thinking) {
        els.statusIndicator.innerHTML = 'Building...';
        els.statusIndicator.classList.add('thinking');
    } else {
        els.statusIndicator.innerHTML = 'Ready';
        els.statusIndicator.classList.remove('thinking');
    }
}

export function logToTerminal(text, type = 'normal') {
    if (!els.terminalOutput) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    els.terminalOutput.appendChild(line);
    els.terminalOutput.scrollTop = els.terminalOutput.scrollHeight;
}

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function updatePreview(html) {
    // If we have a running server, don't use srcdoc, use the url
    if (state.serverUrl) {
        els.previewFrame.removeAttribute('srcdoc');
        els.previewFrame.src = state.serverUrl;
        return;
    }

    const frameDoc = els.previewFrame.contentDocument;
    if (!frameDoc) return;

    let fullHtml = html;
    // Check if it's a full document or just a fragment
    if (!html.trim().startsWith('<!DOCTYPE html>')) {
        fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>
                body { font-family: sans-serif; }
            </style>
        </head>
        <body class="bg-white min-h-screen">
            ${html}
            <script>
                if (window.lucide) lucide.createIcons();
            </script>
        </body>
        </html>
        `;
    }

    // Update Iframe
    frameDoc.open();
    frameDoc.write(fullHtml);
    frameDoc.close();
}
