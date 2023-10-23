/**
 * @swagger
 * tags
 *  name:Categories
 */
/**
 * @swagger
 * /Categories:
 *  get:
 *    description: Use to request all Categories
 *    tags: [Categories]
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
 *                      Description:
 *                          type: string
 *                      Name:
 *                          type: string
 *      '500':
 *        description: SQL_ERROR /
 */
/**
/**
 * /**
 * @swagger
 * /GetCategorieById:
 *  get:
 *    description: Use to request Categorie By Id
 *    tags: [Categories]
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
 * /UpdateCategory:
 *  put:
 *    description: Update Categories
 *    tags: [Categories]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                Id:
 *                   type: string
 *                Description:
 *                   type: string
 *                Name:
 *                   type: string
 *                SportIcon:
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
 */
/**
 * @swagger
 * /DeleteCategory:
 *  post:
 *    description: Delete Categories
 *    tags: [Categories]
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
 */
