/**
 * @swagger
 * /email:
 *   post:
 *     summary: Send an email
 *     description: Send an email with HTML content, supporting single or multiple recipients
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *           examples:
 *             single_recipient:
 *               summary: Send to single recipient
 *               value:
 *                 to: "recipient@example.com"
 *                 subject: "Test Email"
 *                 html: "<h1>Hello World</h1><p>This is a test email.</p>"
 *                 text: "Hello World\nThis is a test email."
 *             multiple_recipients:
 *               summary: Send to multiple recipients
 *               value:
 *                 to: ["recipient1@example.com", "recipient2@example.com"]
 *                 subject: "Test Email to Multiple Recipients"
 *                 html: "<h1>Hello Everyone</h1><p>This is a test email to multiple recipients.</p>"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
