const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Becas',
    version: '1.0.0',
    description: 'Documentación de la API del sistema de gestion de becas',
  },
  servers: [
    {
      url: 'http://localhost:3000', 
      description: 'API GESTION DE BECAS',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], 
  };
  

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;