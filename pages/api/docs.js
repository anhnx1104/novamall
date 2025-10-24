const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NovaMall API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for NovaMall e-commerce platform',
      contact: {
        name: 'NovaMall Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://localhost:8080',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
          description: 'NextAuth session cookie',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              example: '010-1234-5678',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'manager'],
              example: 'user',
            },
            level: {
              type: 'string',
              example: 'bronze',
            },
            points: {
              type: 'number',
              example: 1000,
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Product Name',
            },
            slug: {
              type: 'string',
              example: 'product-name',
            },
            description: {
              type: 'string',
              example: 'Product description',
            },
            price: {
              type: 'number',
              example: 99.99,
            },
            discount: {
              type: 'number',
              example: 10,
            },
            image: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['/uploads/product1.jpg'],
            },
            categories: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            brand: {
              type: 'string',
            },
            colors: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            attributes: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            quantity: {
              type: 'number',
              example: 100,
            },
            type: {
              type: 'string',
              enum: ['simple', 'variable'],
              example: 'simple',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Electronics',
            },
            slug: {
              type: 'string',
              example: 'electronics',
            },
            icon: {
              type: 'string',
              example: '/uploads/icon.png',
            },
            subCategories: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            orderNumber: {
              type: 'string',
              example: 'ORD-20250114-001',
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'number',
                  },
                  price: {
                    type: 'number',
                  },
                },
              },
            },
            totalAmount: {
              type: 'number',
              example: 299.99,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            paymentMethod: {
              type: 'string',
              example: 'stripe',
            },
            shippingAddress: {
              type: 'object',
            },
          },
        },
        Coupon: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            code: {
              type: 'string',
              example: 'SUMMER2025',
            },
            discount: {
              type: 'number',
              example: 20,
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'fixed'],
              example: 'percentage',
            },
            minAmount: {
              type: 'number',
              example: 100,
            },
            maxUses: {
              type: 'number',
              example: 100,
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management',
      },
      {
        name: 'Users',
        description: 'User management and profile operations',
      },
      {
        name: 'Products',
        description: 'Product catalog and management',
      },
      {
        name: 'Categories',
        description: 'Product categories and subcategories',
      },
      {
        name: 'Orders',
        description: 'Order management and tracking',
      },
      {
        name: 'Cart',
        description: 'Shopping cart operations',
      },
      {
        name: 'Checkout',
        description: 'Checkout and payment processing',
      },
      {
        name: 'Coupons',
        description: 'Coupon management',
      },
      {
        name: 'Reviews',
        description: 'Product reviews and ratings',
      },
      {
        name: 'Wishlist',
        description: 'User wishlist operations',
      },
      {
        name: 'Address',
        description: 'User address management',
      },
      {
        name: 'Brands',
        description: 'Brand management',
      },
      {
        name: 'Colors',
        description: 'Product color options',
      },
      {
        name: 'Attributes',
        description: 'Product attributes management',
      },
      {
        name: 'File Upload',
        description: 'File and image upload',
      },
      {
        name: 'Shipping',
        description: 'Shipping methods and costs',
      },
      {
        name: 'Settings',
        description: 'Application settings',
      },
      {
        name: 'Home',
        description: 'Homepage data and public endpoints',
      },
      {
        name: 'Dashboard',
        description: 'Admin dashboard statistics',
      },
      {
        name: 'Points',
        description: 'User points and rewards system',
      },
      {
        name: 'Groups',
        description: 'User groups management',
      },
      {
        name: 'Refund',
        description: 'Refund requests and management',
      },
      {
        name: 'Notifications',
        description: 'User notifications',
      },
      {
        name: 'FAQ',
        description: 'Frequently asked questions',
      },
      {
        name: 'Notice',
        description: 'Notice board management',
      },
      {
        name: 'Event',
        description: 'Event management',
      },
      {
        name: 'Question',
        description: 'Product questions',
      },
    ],
  },
  apis: ['./pages/api/**/*.js'],
};

export default function handler(req, res) {
  const spec = swaggerJsdoc(options);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(spec);
}
