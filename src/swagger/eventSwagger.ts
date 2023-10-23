/**
 * @swagger
 * tags
 *  name:events
 */
/**
 * @swagger
 * /Events:
 *  get:
 *    description: Use to request all Events
 *    tags: [Events]
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *           application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                      Id:
 *                          type: integer
 *                      Name:
 *                          type: string
 *      '500':
 *        description: SQL_ERROR /
 */
/**
/**
 * /**
 * @swagger
 * /GetEventById:
 *  get:
 *    description: Use to request Events By Id
 *    tags: [Events]
 *    parameters:
 *       - name: Id
 *         in: query
 *         schema:
 *           type: integer
 *         required: true
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
 *        description: ENOT_FOUND / DATA_MISSING /
 *      '500':
 *        description: SQL_ERROR /
 */
/**
/**
 * @swagger
 * /UpdateEvent:
 *  put:
 *    description: Update Events
 *    tags: [Events]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                Id:
 *                   type: integer
 *                Name:
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
 *        description: ENOT_FOUND / DATA_MISSING /
 *      '500':
 *        description: SQL_ERROR /
 */
/**
 * @swagger
 * /DeleteEvent:
 *  post:
 *    description: Delete Events
 *    tags: [Events]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                Id:
 *                   type: integer
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
 *        description: ENOT_FOUND / DATA_MISSING /
 *      '500':
 *        description: SQL_ERROR 
 */
