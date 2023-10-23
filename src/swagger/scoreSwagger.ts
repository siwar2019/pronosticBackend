/**
 * @swagger
 * tags
 *  name:score
 */
/**
 * @swagger
 * /Score:
 *  get:
 *    description: Use to request all score
 *    tags: [score]
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
 * /GetScoreById:
 *  get:
 *    description: Use to request score By Id
 *    tags: [score]
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
 */
/**
/**
 * @swagger
 * /UpdateScore:
 *  put:
 *    description: Update score
 *    tags: [score]
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
 * /DeleteScore:
 *  post:
 *    description: Delete score
 *    tags: [score]
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
 *        description: SQL_ERROR /
 */
