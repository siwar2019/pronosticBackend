/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /Login:
 *  post:
 *    description: Use to login
 *    tags: [User]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                email:
 *                   type: string
 *                password:
 *                   type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                      success:
 *                          type: boolean
 *                      data:
 *                          type: object
 *                          properties:
 *                              admin:
 *                                  type: object
 *                                  properties:
 *                                      FirstName:
 *                                          type: string
 *                                      LastName:
 *                                          type: string
 *                                      IdUser:
 *                                          type: integer
 *                      message:
 *                          type: string
 *                      token:
 *                          type: string
 *      '400':
 *        description: EMAIL ET MOT DE PASSE REQUIRED / wrong login/password /
 *      '500':
 *        description: SQL_ERROR /
 */

/**
 * @swagger
 * /Register:
 *  post:
 *    description: Use to Register
 *    tags: [User]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                email:
 *                   type: string
 *                password:
 *                   type: string
 *                social_reason:
 *                   type: string
 *                numTelephone:
 *                   type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                      success:
 *                          type: boolean
 *                      message:
 *                          type: string
 *      '400':
 *        description: EMAIL_EXISTS / DATA_MISSING /
 *      '500':
 *        description: SQL_ERROR /
 */
