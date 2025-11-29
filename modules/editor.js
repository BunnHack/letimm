import { EditorView, basicSetup } from 'https://esm.sh/codemirror@6.0.1';
import { html } from 'https://esm.sh/@codemirror/lang-html@6.4.5';
import { css } from 'https://esm.sh/@codemirror/lang-css@6.2.0';
import { javascript } from 'https://esm.sh/@codemirror/lang-javascript@6.1.9';
import { oneDark } from 'https://esm.sh/@codemirror/theme-one-dark@6.1.2';
import { state } from './state.js';
import { els } from './ui.js';

let editor;

export function initEditor() {
    if (!els.codeEditorMount) return;
    
    // Clean up existing editor if any
    els.codeEditorMount.innerHTML = '';
    
    if (!state.activeFile || !state.files[state.activeFile]) return;

    editor = new EditorView({
        doc: state.files[state.activeFile].content,
        extensions: [
            basicSetup,
            oneDark,
            html(),
            EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    state.files[state.activeFile].content = update.state.doc.toString();
                }
            })
        ],
        parent: els.codeEditorMount
    });
}

export function updateEditorContent(content) {
    if (!editor) return;
    const transaction = editor.state.update({
        changes: { from: 0, to: editor.state.doc.length, insert: content }
    });
    editor.dispatch(transaction);
}

export function displayFile(filename) {
    if (!filename || !state.files[filename]) {
        if (editor) {
            editor.destroy();
            editor = null;
        }
        if (els.codeEditorMount) els.codeEditorMount.innerHTML = '';
        return;
    }

    if (state.files[filename]) {
        const content = state.files[filename].content;

        if (editor) {
            // Destroy the old editor first to avoid triggering its update listener with new content
            editor.destroy();
        }

        let langExt = html();
        if (filename.endsWith('.css')) langExt = css();
        if (filename.endsWith('.js')) langExt = javascript();

        editor = new EditorView({
            doc: content,
            extensions: [
                basicSetup,
                oneDark,
                langExt,
                EditorView.updateListener.of(update => {
                    if (update.docChanged) {
                        state.files[filename].content = update.state.doc.toString();
                    }
                })
            ],
            parent: els.codeEditorMount
        });
    }
}

export function renderFileExplorer() {
    if (!els.fileList) return;
    els.fileList.innerHTML = '';

    Object.keys(state.files).forEach(filename => {
        const div = document.createElement('div');
        div.className = `file-item ${state.activeFile === filename ? 'active' : ''}`;

        let icon = 'file';
        if (filename.endsWith('.html')) icon = 'file-code';
        else if (filename.endsWith('.css')) icon = 'palette';
        else if (filename.endsWith('.js')) icon = 'file-code-2';
        else if (filename.endsWith('.json')) icon = 'braces';
        else if (filename.endsWith('.md')) icon = 'file-text';

        div.innerHTML = `<i data-lucide="${icon}"></i><span>${filename}</span>`;
        div.onclick = () => {
            state.activeFile = filename;
            displayFile(filename);
            renderFileExplorer();
        };
        els.fileList.appendChild(div);
    });

    if (window.lucide) window.lucide.createIcons();
}