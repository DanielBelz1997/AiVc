import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VcAi Backend API",
      version: "1.0.0",
      description: "API documentation for VcAi Backend",
      contact: {
        name: "VcAi Team",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-production-url.com/api"
            : `http://localhost:${process.env.PORT || 3000}/api`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            message: {
              type: "string",
              description: "Detailed error message",
            },
          },
        },
        InitPromptResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
              example: true,
            },
            data: {
              type: "string",
              description: "The initial prompt data",
              example: "Init prompt",
            },
            message: {
              type: "string",
              description: "Optional message",
            },
            error: {
              type: "string",
              description: "Error message if any",
            },
          },
          required: ["success"],
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "VcAi API Documentation",
};

export { swaggerUi };
