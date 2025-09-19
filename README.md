# Console.log Cleaner

A JavaScript utility that removes `console.log` statements from your code files. Perfect for cleaning up production code by removing debug statements while preserving all other functionality.

## Features

✅ **Multi-line Support**: Handles console.log statements that span multiple lines  
✅ **Smart Parsing**: Preserves strings, template literals, and nested expressions  
✅ **Automatic Backups**: Creates backup files before making changes  
✅ **Detailed Statistics**: Shows exactly what was removed  
✅ **Safe Processing**: Only removes actual console.log statements, not similar code  

## Installation

No installation required! Just place the `console-log-cleaner.js` file in your project directory.

## Usage

```bash
node console-log-cleaner.js <filename>
```

### Examples

```bash
# Clean a single file
node console-log-cleaner.js popup.js

# Clean multiple files (run separately)
node console-log-cleaner.js content.js
node console-log-cleaner.js background.js
```

## What It Removes

The cleaner removes all variations of `console.log` statements:

### Simple statements
```javascript
console.log("Simple message");
console.log('Single quotes');
console.log(`Template literal`);
```

### Multi-line statements
```javascript
console.log(
  `🔄 Payment status kontrol ediliyor... (${(attempts * checkIntervalMs) / 1000}s)`,
);
```

### Complex expressions
```javascript
console.log(
  "Complex data:",
  {
    id: user.id,
    status: getStatus(),
    timestamp: new Date().toISOString()
  }
);
```

### Nested function calls
```javascript
console.log(
  `Function result: ${Math.max(1, 2, 3)} and ${JSON.stringify({ test: "value" })}`
);
```

## What It Preserves

The cleaner is smart enough to **NOT** remove:

- `Math.log()` functions
- Comments containing "console.log"
- Variables or functions with "log" in their names
- String literals that contain "console.log"

## Output

When you run the cleaner, you'll see:

```
📖 Reading file: popup.js
💾 Backup created: popup.js.backup
✅ Cleaning completed!
📊 Statistics:
   - Original console.log statements: 53
   - Removed console.log statements: 53
   - Remaining console.log statements: 0
🎉 Successfully removed 53 console.log statement(s) from popup.js
```

## Backup Files

The tool automatically creates backup files with the `.backup` extension before making any changes. If something goes wrong, you can always restore:

```bash
cp popup.js.backup popup.js
```

## Supported File Types

- `.js` (JavaScript)
- `.jsx` (React JSX)
- `.ts` (TypeScript)
- `.tsx` (TypeScript JSX)

The tool will work with other file types but will show a warning.

## Safety Features

1. **Automatic Backups**: Original files are always preserved
2. **Validation**: Checks file existence before processing
3. **Smart Parsing**: Uses proper JavaScript parsing to avoid false positives
4. **Statistics**: Shows exactly what was changed

## Use Cases

- **Production Deployment**: Remove debug statements before deploying
- **Code Cleanup**: Clean up development code for sharing
- **Performance**: Eliminate console.log overhead in production
- **Security**: Remove potentially sensitive debug information

## Example Before/After

**Before:**
```javascript
function processPayment() {
  console.log("Starting payment process...");
  
  const result = calculateTotal();
  console.log(
    `Payment calculation: ${result.amount} ${result.currency}`,
    result.details
  );
  
  return result;
}
```

**After:**
```javascript
function processPayment() {
  
  const result = calculateTotal();
  
  return result;
}
```

## Technical Details

The cleaner uses a line-by-line parsing approach that:

1. Identifies lines starting with `console.log(`
2. Tracks parentheses, strings, and template literals
3. Handles nested expressions and multi-line statements
4. Removes complete statements while preserving code structure

## Error Handling

If the tool encounters an error:
- It will show a descriptive error message
- Original files remain unchanged
- No partial modifications are made

## Contributing

Found a bug or edge case? The cleaner handles most JavaScript syntax correctly, but complex cases with unusual formatting might need attention.

---

**⚠️ Important**: Always test your code after cleaning to ensure functionality is preserved. While the tool is designed to be safe, complex JavaScript syntax edge cases may exist.
