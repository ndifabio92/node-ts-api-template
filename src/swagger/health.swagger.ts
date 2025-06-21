/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check application health status
 *     description: Returns the current health status of the application including uptime, version, and timestamp
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HealthStatus'
 *                 message:
 *                   type: string
 *                   example: Health check completed
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
