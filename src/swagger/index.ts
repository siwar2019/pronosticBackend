const swaggerJsDoc = require("swagger-jsdoc");


const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        version: "1.0.0",
        title: "Pronostic API",
        description: "Pronostic API Information",
        contact: {
          name: "Wind Consulting Tunisia"
        },
        servers: ["http://localhost:5000"]
      },
      // securityDefinitions: {
      //   auth: {
      //     type: 'apiKey',
      //     name: 'Authorization',
      //     in: 'Header'
      //   }
      // },
      components: {
        securitySchemes: {
          auth: {
            type: "http",
            name: 'Authorization',
            scheme: "bearer",
            in: "header",
            // bearerFormat: "JWT"
          },
        }
      },
      security: [
        { auth: [] }
      ]
    },
    // ['.routes/*.js']
    apis: ["./src/swagger/**/*.ts",]
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);

  module.exports = swaggerDocs