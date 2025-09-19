#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Console.log Cleaner
 * Removes console.log statements from JavaScript files
 * Usage: node console-log-cleaner.js <filename>
 */

function cleanConsoleLog(content) {
  const lines = content.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if this line starts with console.log
    if (trimmedLine.startsWith("console.log(")) {
      // Find the complete console.log statement
      let consoleLogContent = line;
      let parenCount = 0;
      let inString = false;
      let stringChar = "";
      let inTemplate = false;
      let templateDepth = 0;
      let j = i;

      // Count parentheses in the current line to see if statement is complete
      for (let k = 0; k < consoleLogContent.length; k++) {
        const char = consoleLogContent[k];
        const prevChar = k > 0 ? consoleLogContent[k - 1] : "";

        // Handle escape sequences
        if (prevChar === "\\" && (inString || inTemplate)) {
          continue;
        }

        // Handle strings
        if (!inString && !inTemplate && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar) {
          inString = false;
          stringChar = "";
        }

        // Handle template literals
        else if (!inString && char === "`") {
          inTemplate = !inTemplate;
          if (!inTemplate) templateDepth = 0;
        }

        // Handle template expressions
        else if (inTemplate && prevChar === "$" && char === "{") {
          templateDepth++;
        } else if (inTemplate && char === "}" && templateDepth > 0) {
          templateDepth--;
        }

        // Count parentheses when not in strings
        else if (!inString && (!inTemplate || templateDepth > 0)) {
          if (char === "(") {
            parenCount++;
          } else if (char === ")") {
            parenCount--;
          }
        }
      }

      // If parentheses are balanced, this console.log is complete
      if (parenCount === 0) {
        // Skip this line entirely
        i++;
        continue;
      }

      // Multi-line console.log - keep reading until we find the closing parenthesis
      j = i + 1;
      while (j < lines.length && parenCount > 0) {
        const nextLine = lines[j];
        consoleLogContent += "\n" + nextLine;

        for (let k = 0; k < nextLine.length; k++) {
          const char = nextLine[k];
          const prevChar = k > 0 ? nextLine[k - 1] : "";

          // Handle escape sequences
          if (prevChar === "\\" && (inString || inTemplate)) {
            continue;
          }

          // Handle strings
          if (!inString && !inTemplate && (char === '"' || char === "'")) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar) {
            inString = false;
            stringChar = "";
          }

          // Handle template literals
          else if (!inString && char === "`") {
            inTemplate = !inTemplate;
            if (!inTemplate) templateDepth = 0;
          }

          // Handle template expressions
          else if (inTemplate && prevChar === "$" && char === "{") {
            templateDepth++;
          } else if (inTemplate && char === "}" && templateDepth > 0) {
            templateDepth--;
          }

          // Count parentheses when not in strings
          else if (!inString && (!inTemplate || templateDepth > 0)) {
            if (char === "(") {
              parenCount++;
            } else if (char === ")") {
              parenCount--;
            }
          }
        }

        j++;
      }

      // Skip all lines that were part of the console.log statement
      i = j;
      continue;
    }

    // This line is not a console.log statement, keep it
    result.push(line);
    i++;
  }

  // Join the lines back and clean up excessive empty lines
  let cleanedContent = result.join("\n");
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n+/g, "\n\n");

  return cleanedContent;
}

function processFile(filename) {
  try {
    // Check if file exists
    if (!fs.existsSync(filename)) {
      console.error(`❌ Error: File '${filename}' not found.`);
      process.exit(1);
    }

    // Read the file
    const content = fs.readFileSync(filename, "utf8");
    console.log(`📖 Reading file: ${filename}`);

    // Count original console.log statements
    const originalConsoleLogCount = (content.match(/console\.log\s*\(/g) || [])
      .length;

    // Clean console.log statements
    const cleanedContent = cleanConsoleLog(content);

    // Count remaining console.log statements
    const remainingConsoleLogCount = (
      cleanedContent.match(/console\.log\s*\(/g) || []
    ).length;
    const removedCount = originalConsoleLogCount - remainingConsoleLogCount;

    // Create backup of original file
    const backupFilename = `${filename}.backup`;
    fs.writeFileSync(backupFilename, content);
    console.log(`💾 Backup created: ${backupFilename}`);

    // Write cleaned content back to original file
    fs.writeFileSync(filename, cleanedContent);

    console.log(`✅ Cleaning completed!`);
    console.log(`📊 Statistics:`);
    console.log(
      `   - Original console.log statements: ${originalConsoleLogCount}`,
    );
    console.log(`   - Removed console.log statements: ${removedCount}`);
    console.log(
      `   - Remaining console.log statements: ${remainingConsoleLogCount}`,
    );

    if (removedCount === 0) {
      console.log(`ℹ️  No console.log statements found to remove.`);
    } else {
      console.log(
        `🎉 Successfully removed ${removedCount} console.log statement(s) from ${filename}`,
      );
    }
  } catch (error) {
    console.error(`❌ Error processing file: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      `Console.log Cleaner - Removes console.log statements from JavaScript files`,
    );
    console.log(`Usage: node console-log-cleaner.js <filename>`);
    console.log(`Example: node console-log-cleaner.js content.js`);
    console.log(`\n🔧 Features:`);
    console.log(`   • Handles multi-line console.log statements`);
    console.log(
      `   • Preserves strings, template literals, and nested expressions`,
    );
    console.log(`   • Creates automatic backup files`);
    console.log(`   • Provides detailed statistics`);
    console.log(
      `\n⚠️  This tool modifies files in place. Backups are created automatically.`,
    );
    process.exit(1);
  }

  const filename = args[0];

  // Validate file extension
  const ext = path.extname(filename).toLowerCase();
  if (![".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
    console.warn(
      `⚠️  Warning: File '${filename}' doesn't appear to be a JavaScript/TypeScript file.`,
    );
    console.log(`Supported extensions: .js, .jsx, .ts, .tsx`);
    console.log(`Proceeding anyway...`);
  }

  processFile(filename);
}

// Handle command line execution
if (require.main === module) {
  main();
}

module.exports = { cleanConsoleLog, processFile };
