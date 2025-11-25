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
                    "content": "You are an expert frontend developer. Generate a modern, responsive HTML component using Tailwind CSS based on the user's request. Return ONLY the raw HTML code. Do not include markdown code blocks (```). Do not include <html>, <head>, or <body> tags. Just the component markup."
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