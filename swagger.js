const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LillyShop API",
      version: "1.0.0",
      description: "API documentation for LillyShop backend using MySQL",
    },
    servers: [
      {
        url: "http://localhost:3600", // Change to your deployed server URL
      },
    ],
    components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your JWT token in the format: Bearer <token>",
          },
        },
      },
    security: [{ BearerAuth: [] }], // Applies globally
  },
  apis: ["./routes/*.js"], // Point to route files for documentation
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
  
module.exports = setupSwagger;