# Wasmoon - Vanilla JavaScript Usage Guide

This guide explains how to use Wasmoon in vanilla JavaScript environments without any build tools or bundlers.

## Quick Start

### Browser (via CDN)

Simply include the UMD script from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Wasmoon Example</title>
</head>
<body>
    <!-- Load Wasmoon UMD build -->
    <script src="https://unpkg.com/wasmoon/dist/index.umd.js"></script>
    
    <script>
        (async function() {
            // Create a Lua factory
            const factory = new Wasmoon.LuaFactory();
            
            // Create a Lua engine
            const engine = await factory.createEngine();
            
            // Execute Lua code
            const result = await engine.doString('return 1 + 2');
            console.log('Result:', result); // Output: Result: 3
        })();
    </script>
</body>
</html>
```

## Installation Options

### Option 1: CDN (Recommended for quick testing)

```html
<!-- Latest version -->
<script src="https://unpkg.com/wasmoon/dist/index.umd.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/wasmoon@1.16.0/dist/index.umd.js"></script>
```

### Option 2: Download and host locally

1. Download the files from unpkg or npm:
   - `dist/index.umd.js` - The JavaScript library
   - `dist/glue.wasm` - The WebAssembly binary

2. Host them on your server and include:

```html
<script src="/path/to/index.umd.js"></script>
<script>
    // Specify the WASM file location
    const factory = new Wasmoon.LuaFactory('/path/to/glue.wasm');
</script>
```

## Basic Usage

### Creating an Engine

```javascript
// Create factory (WASM loads automatically from CDN in browser)
const factory = new Wasmoon.LuaFactory();

// Create engine with default settings
const engine = await factory.createEngine();

// Create engine with custom options
const engine = await factory.createEngine({
    openStandardLibs: true,    // Load Lua standard libraries
    injectObjects: false,       // Inject JS objects into Lua
    enableProxy: true,          // Enable proxy for JS object access
    traceAllocations: false,    // Track memory allocations
});
```

### Executing Lua Code

```javascript
// Execute a string of Lua code
const result = await engine.doString('return 10 * 2');
console.log(result); // 20

// Synchronous execution (blocks until complete)
const result = engine.doStringSync('return "Hello"');
console.log(result); // "Hello"
```

### Working with Files

```javascript
// Mount a file into the Lua virtual filesystem
await factory.mountFile('/scripts/mylib.lua', `
    function greet(name)
        return "Hello, " .. name .. "!"
    end
    
    return {
        greet = greet
    }
`);

// Execute the mounted file
await engine.doFile('/scripts/mylib.lua');
```

## JavaScript and Lua Interop

### Passing Values from JavaScript to Lua

```javascript
// Set a JavaScript value in Lua's global table
engine.global.set('message', 'Hello from JavaScript!');
engine.global.set('count', 42);
engine.global.set('items', [1, 2, 3, 4, 5]);
engine.global.set('config', { name: 'test', enabled: true });

// Use the values in Lua
await engine.doString(`
    print(message)           -- Hello from JavaScript!
    print(count * 2)          -- 84
    print(#items)             -- 5
    print(config.name)        -- test
`);
```

### Calling JavaScript Functions from Lua

```javascript
// Register a JavaScript function
engine.global.set('jsLog', function(...args) {
    console.log('Lua says:', ...args);
});

engine.global.set('jsFetch', async function(url) {
    const response = await fetch(url);
    return response.json();
});

// Call from Lua
await engine.doString(`
    jsLog("Hello from Lua!")
    
    -- Async function calls work with :await
    local data = jsFetch:await("https://api.example.com/data")
    jsLog(data)
`);
```

### Calling Lua Functions from JavaScript

```javascript
// Define a Lua function
await engine.doString(`
    function add(a, b)
        return a + b
    end
    
    function multiply(a, b)
        return a * b
    end
`);

// Call from JavaScript
const sum = engine.global.get('add')(5, 3);
console.log(sum); // 8

const product = engine.global.get('multiply')(4, 7);
console.log(product); // 28
```

### Working with Tables

```javascript
// Create a table in Lua
await engine.doString(`
    person = {
        name = "Alice",
        age = 30,
        greet = function(self)
            return "Hi, I'm " .. self.name
        end
    }
`);

// Access table from JavaScript
const person = engine.global.get('person');
console.log(person.name);     // Alice
console.log(person.age);      // 30
console.log(person:greet());  // Hi, I'm Alice
```

## Async/Await Support

Wasmoon supports async operations between JavaScript and Lua:

```javascript
// Register an async JavaScript function
engine.global.set('delay', function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
});

// Use in Lua with :await
await engine.doString(`
    print("Starting...")
    delay:await(1000)
    print("1 second passed!")
`);
```

## Error Handling

```javascript
try {
    await engine.doString('error("Something went wrong")');
} catch (error) {
    console.error('Lua error:', error.message);
}

// Lua pcall for protected calls
const result = await engine.doString(`
    local success, err = pcall(function()
        error("test error")
    end)
    return success, err
`);
console.log(result); // [false, "test error"]
```

## Memory Management

```javascript
// Create engine with memory tracking
const engine = await factory.createEngine({
    traceAllocations: true
});

// Check memory usage
console.log('Memory used:', engine.global.getMemoryUsed(), 'bytes');

// Set memory limit
engine.global.setMemoryMax(10 * 1024 * 1024); // 10 MB

// Clean up when done
engine.global.close();
```

## Complete Example

Here's a complete HTML file demonstrating various features:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wasmoon - Lua in Browser</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        #output {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Consolas', monospace;
            white-space: pre-wrap;
            min-height: 200px;
        }
        button {
            padding: 10px 20px;
            margin: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Wasmoon - Lua in Your Browser</h1>
    
    <div>
        <button onclick="runBasic()">Basic Example</button>
        <button onclick="runInterop()">JS Interop</button>
        <button onclick="runAsync()">Async Example</button>
        <button onclick="runTable()">Table Example</button>
    </div>
    
    <h2>Output:</h2>
    <div id="output">Loading Lua engine...</div>
    
    <script src="https://unpkg.com/wasmoon/dist/index.umd.js"></script>
    <script>
        let engine;
        const output = document.getElementById('output');
        
        function log(...args) {
            output.textContent += args.join(' ') + '\n';
        }
        
        function clearOutput() {
            output.textContent = '';
        }
        
        // Initialize engine
        async function init() {
            const factory = new Wasmoon.LuaFactory();
            engine = await factory.createEngine();
            
            // Register print function
            engine.global.set('print', function(...args) {
                log(...args);
            });
            
            output.textContent = 'Lua engine ready!\n\n';
        }
        
        async function runBasic() {
            clearOutput();
            log('--- Basic Lua Example ---');
            
            const result = await engine.doString(`
                local x = 10
                local y = 20
                print("Sum:", x + y)
                print("Product:", x * y)
                
                -- Tables and loops
                local fruits = {"apple", "banana", "cherry"}
                for i, fruit in ipairs(fruits) do
                    print(i, fruit)
                end
                
                return x + y
            `);
            log('Returned:', result);
        }
        
        async function runInterop() {
            clearOutput();
            log('--- JavaScript Interop ---');
            
            // Pass JS values to Lua
            engine.global.set('jsArray', [1, 2, 3, 4, 5]);
            engine.global.set('jsObject', { name: 'Alice', age: 25 });
            
            // Pass JS function to Lua
            engine.global.set('double', function(x) {
                return x * 2;
            });
            
            await engine.doString(`
                print("JS Array length:", #jsArray)
                print("JS Object name:", jsObject.name)
                
                -- Call JS function
                local result = double(21)
                print("Double of 21:", result)
            `);
        }
        
        async function runAsync() {
            clearOutput();
            log('--- Async Operations ---');
            
            // Register async JS function
            engine.global.set('wait', function(ms) {
                log(`Waiting ${ms}ms...`);
                return new Promise(resolve => {
                    setTimeout(() => resolve('done!'), ms);
                });
            });
            
            await engine.doString(`
                print("Starting async operation...")
                local result = wait:await(500)
                print("Result:", result)
            `);
        }
        
        async function runTable() {
            clearOutput();
            log('--- Lua Tables ---');
            
            await engine.doString(`
                -- Create a class-like structure
                local Person = {}
                Person.__index = Person
                    
                function Person:new(name, age)
                    return setmetatable({
                        name = name,
                        age = age
                    }, self)
                end
                
                function Person:greet()
                    return "Hello, I'm " .. self.name .. "!"
                end
                
                -- Create instance
                local alice = Person:new("Alice", 30)
                print(alice:greet())
                print(alice.name, "is", alice.age, "years old")
            `);
        }
        
        // Start the engine
        init().catch(err => {
            output.textContent = 'Error: ' + err.message;
        });
    </script>
</body>
</html>
```

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 57+ | Yes |
| Firefox 52+ | Yes |
| Safari 11+ | Yes |
| Edge 16+ | Yes |
| IE 11 | No (WebAssembly not supported) |

## Troubleshooting

### WASM Loading Issues

If you see errors about loading `glue.wasm`:

```javascript
// Specify the WASM location explicitly
const factory = new Wasmoon.LuaFactory('/path/to/glue.wasm');
```

### CORS Issues

When hosting locally, ensure your server sends correct CORS headers for `.wasm` files:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### Memory Errors

If you encounter memory errors:

```javascript
// Increase memory or track allocations
const engine = await factory.createEngine({
    traceAllocations: true
});

// Set a higher memory limit
engine.global.setMemoryMax(50 * 1024 * 1024); // 50 MB
```

## API Reference

### LuaFactory

| Method | Description |
|--------|-------------|
| `constructor(wasmUri?, envVars?)` | Create a new factory |
| `createEngine(options?)` | Create a Lua engine |
| `mountFile(path, content)` | Mount a file in the virtual FS |
| `getLuaModule()` | Get the raw WASM module |

### LuaEngine

| Method | Description |
|--------|-------------|
| `doString(code)` | Execute Lua code (async) |
| `doFile(path)` | Execute a Lua file (async) |
| `doStringSync(code)` | Execute Lua code (sync) |
| `doFileSync(path)` | Execute a Lua file (sync) |

### LuaGlobal

| Method | Description |
|--------|-------------|
| `get(name)` | Get a global value |
| `set(name, value)` | Set a global value |
| `close()` | Close and cleanup |

## More Resources

- [GitHub Repository](https://github.com/ceifa/wasmoon)
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)
- [npm Package](https://www.npmjs.com/package/wasmoon)
