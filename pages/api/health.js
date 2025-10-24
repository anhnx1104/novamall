/**
 * Health check API endpoint for AWS Target Group
 * This endpoint always returns a 200 OK status to indicate the service is running
 * AWS Target Group expects a 200 response for healthy instances
 */

export default function healthHandler(req, res) {
  // Always return 200 status with healthy status
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}
