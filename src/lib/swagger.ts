import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATLVS API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for the ATLVS project management platform',
      contact: {
        name: 'ATLVS Support',
        url: 'https://atlvs.one/contact',
        email: 'support@atlvs.one',
      },
      license: {
        name: 'Proprietary',
        url: 'https://atlvs.one/legal/terms',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Application Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase JWT token from authentication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Detailed error description',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'degraded', 'unhealthy'],
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            version: {
              type: 'string',
            },
            environment: {
              type: 'string',
            },
            checks: {
              type: 'object',
            },
            system: {
              type: 'object',
            },
            responseTime: {
              type: 'number',
            },
          },
        },
        FeatureFlags: {
          type: 'object',
          properties: {
            flags: {
              type: 'object',
              additionalProperties: true,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            environment: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'System',
        description: 'System health and monitoring endpoints',
      },
      {
        name: 'Feature Flags',
        description: 'Feature flag management',
      },
      {
        name: 'Invitations',
        description: 'Team invitation management',
      },
      {
        name: 'Data Export',
        description: 'GDPR-compliant data export and import',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to API routes
}

export const swaggerSpec = swaggerJsdoc(options)
