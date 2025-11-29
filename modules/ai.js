const API_KEY = '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';

export async function generateWithAI(prompt, onChunk) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.href,
            "X-Title": "Lovable Clone"
        },
        body: JSON.stringify({
            "model": "x-ai/grok-4.1-fast",
            "stream": true,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert full-stack developer. Generate a complete, modern, responsive web application based on the user's request. You can create multiple files (HTML, CSS, JS, JSON). \n\nIMPORTANT: Wrap each file's content in these tags:\n<file name=\"filename.extension\">\n... content ...\n</file>\n\nAlways include an 'index.html' file as the entry point.\nEnsure the code is fully functional and self-contained. Do not include markdown code blocks."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        let errorMessage = `API Error ${response.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
                errorMessage = errorJson.error.message;
            } else if (errorJson.message) {
                errorMessage = errorJson.message;
            }
        } catch (e) {
            errorMessage = `${errorMessage}: ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6);
                if (dataStr === '[DONE]') continue;
                try {
                    const data = JSON.parse(dataStr);
                    const content = data.choices[0]?.delta?.content;
                    if (content) onChunk(content);
                } catch (e) {
                    // Ignore partial parse errors
                }
            }
        }
    }
}