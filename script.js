import { state } from './modules/state.js';
import * as UI from './modules/ui.js';
import * as AI from './modules/ai.js';
import * as Editor from './modules/editor.js';
import * as WC from './modules/webcontainer.js';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Lovable Clone Initializing...');
    
    if (window.lucide) window.lucide.createIcons();
    
    // Start WebContainer Boot Process
    WC.initWebContainer();

    // Sidebar Toggle
    if (UI.els.sidebarToggle) {
        UI.els.sidebarToggle.addEventListener('click', () => {
            state.sidebarOpen = !state.sidebarOpen;
            if (state.sidebarOpen) {
                UI.els.sidebar.classList.add('open');
            } else {
                UI.els.sidebar.classList.remove('open');
            }
        });
    }

    // Initialize Editor
    Editor.initEditor();

    if (UI.els.initialSendBtn) {
        UI.els.initialSendBtn.addEventListener('click', () => handleInput(UI.els.initialInput.value));
    }
    
    if (UI.els.chatSendBtn) {
        UI.els.chatSendBtn.addEventListener('click', () => handleInput(UI.els.chatInput.value));
    }
    
    // Enter key support
    const inputs = [UI.els.initialInput, UI.els.chatInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleInput(input.value);
                }
            });
        }
    });

    // Suggestions
    if (UI.els.suggestions) {
        UI.els.suggestions.forEach(btn => {
            btn.addEventListener('click', () => handleInput(btn.dataset.prompt));
        });
    }

    // Tabs
    if (UI.els.tabs) {
        UI.els.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update Active State
                UI.els.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Toggle View
                const view = tab.dataset.view;
                UI.els.previewFrame.classList.add('hidden');
                UI.els.codeView.classList.add('hidden');
                UI.els.terminalView.classList.add('hidden');

                if (view === 'code') {
                    UI.els.codeView.classList.remove('hidden');
                } else if (view === 'terminal') {
                    UI.els.terminalView.classList.remove('hidden');
                } else {
                    UI.els.previewFrame.classList.remove('hidden');
                }
            });
        });
    }

    Editor.renderFileExplorer();
    Editor.displayFile(state.activeFile);

    // History Button
    if(UI.els.historyBtn) {
        UI.els.historyBtn.addEventListener('click', () => {
            alert('History feature coming soon!');
        });
    }
});

// Core Logic
async function handleInput(text) {
    if (!text.trim() || state.isGenerating) return;
    
    // Clear inputs
    if (UI.els.initialInput) UI.els.initialInput.value = '';
    if (UI.els.chatInput) UI.els.chatInput.value = '';

    // Switch view if needed
    if (state.view === 'initial') {
        state.view = 'project';
        UI.els.emptyState.classList.add('hidden');
        UI.els.projectView.classList.remove('hidden');
        
        // Trigger WebContainer file mount and start if first time
        if (state.webContainerLoaded) {
            await WC.mountFiles();
            WC.startDevServer();
        }
    }

    // Add User Message
    UI.addMessage('user', text);
    
    // Start Generation
    state.isGenerating = true;
    UI.updateStatus(true);
    
    // Add AI Message container
    const aiMsgId = UI.addMessage('ai', "Thinking...");
    const aiMsgEl = document.getElementById(aiMsgId);
    const contentEl = aiMsgEl.querySelector('.msg-content');

    let accumulatedCode = "";

    try {
        contentEl.innerHTML = `Starting generation...`;
        
        await AI.generateWithAI(text, (chunk) => {
            accumulatedCode += chunk;
            
            // Update UI feedback
            contentEl.innerHTML = `Building... <span style="font-family:monospace; opacity:0.7">(${accumulatedCode.length} chars)</span>`;
            
            // Live update of code view if active
            state.files['index.html'].content = accumulatedCode;
            if (state.activeFile === 'index.html') {
                 Editor.updateEditorContent(accumulatedCode);
            }
        });
        
        if (!accumulatedCode.trim()) {
            throw new Error("No code was generated from the response.");
        }
        
        // Clean up markdown if present
        let componentCode = accumulatedCode.replace(/```html/g, '').replace(/```/g, '').trim();
        
        // Wrap in full HTML structure with unpkg Tailwind (supports CORP)
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        body { font-family: sans-serif; background-color: #ffffff; }
    </style>
</head>
<body class="bg-white">
    ${componentCode}
    <script type="module" src="script.js"></script>
    <script>
        window.onload = () => {
            if (window.lucide) lucide.createIcons();
        };
    </script>
</body>
</html>`;
        
        // Update State
        state.files['index.html'].content = fullHtml;
        if (state.activeFile === 'index.html') {
             Editor.updateEditorContent(fullHtml);
        }

        // Update Preview with full wrapper
        UI.updatePreview(fullHtml);
        
        // Sync with WebContainer
        if (state.webContainerLoaded) {
            await WC.writeFile('index.html', fullHtml);
        }

        // Update AI message
        contentEl.innerHTML = `<p>I've built that for you. Check the preview!</p><div class="code-block">${UI.escapeHtml(componentCode)}</div>`;
        
        // Play sound
        UI.playSuccessSound();
    } catch (error) {
        console.error(error);
        contentEl.innerHTML = `Sorry, something went wrong: ${error.message}`;
    }
    
    // Finish
    UI.updateStatus(false);
    state.isGenerating = false;
}
