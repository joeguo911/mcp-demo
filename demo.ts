import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create a Server instance
const server = new Server(
  {
    name: "demo-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number to add",
            },
            b: {
              type: "number",
              description: "Second number to add",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "greet",
        description: "Generate a personalized greeting",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the person to greet",
            },
            language: {
              type: "string",
              description: "Language for the greeting",
              enum: ["en", "zh", "es", "fr"],
            },
          },
          required: ["name"],
        },
      },
      {
        name: "calculate",
        description: "Perform basic mathematical operations",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              description: "Mathematical operation to perform",
              enum: ["add", "subtract", "multiply", "divide"],
            },
            x: {
              type: "number",
              description: "First operand",
            },
            y: {
              type: "number",
              description: "Second operand",
            },
          },
          required: ["operation", "x", "y"],
        },
      },
    ],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "add") {
      const { a, b } = args as { a: number; b: number };
      const result = a + b;
      return {
        content: [
          {
            type: "text",
            text: `The sum of ${a} and ${b} is ${result}`,
          },
        ],
      };
    }

    if (name === "greet") {
      const { name: personName, language = "en" } = args as {
        name: string;
        language?: string;
      };

      const greetings: Record<string, string> = {
        en: `Hello, ${personName}! How are you today?`,
        zh: `你好，${personName}！今天过得怎么样？`,
        es: `¡Hola, ${personName}! ¿Cómo estás hoy?`,
        fr: `Bonjour, ${personName}! Comment allez-vous aujourd'hui?`,
      };

      const greeting = greetings[language] || greetings.en;

      return {
        content: [
          {
            type: "text",
            text: greeting,
          },
        ],
      };
    }

    if (name === "calculate") {
      const { operation, x, y } = args as {
        operation: string;
        x: number;
        y: number;
      };

      let result: number;
      let operationSymbol: string;

      switch (operation) {
        case "add":
          result = x + y;
          operationSymbol = "+";
          break;
        case "subtract":
          result = x - y;
          operationSymbol = "-";
          break;
        case "multiply":
          result = x * y;
          operationSymbol = "×";
          break;
        case "divide":
          if (y === 0) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Division by zero is not allowed",
                },
              ],
            };
          }
          result = x / y;
          operationSymbol = "÷";
          break;
        default:
          return {
            content: [
              {
                type: "text",
                text: `Error: Unknown operation "${operation}"`,
              },
            ],
          };
      }

      return {
        content: [
          {
            type: "text",
            text: `${x} ${operationSymbol} ${y} = ${result}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Unknown tool: ${name}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
