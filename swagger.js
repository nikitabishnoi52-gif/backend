
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Softech API",
            version: "1.0.0",
            description: "API documentation for Softech Backend"
        },
        servers: [
            {
                url: "https://backend-5qnd.onrender.com"
            }
        ]
    },
    apis: ["./Routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
