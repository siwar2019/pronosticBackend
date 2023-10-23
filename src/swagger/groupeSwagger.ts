/**
 * @swagger
 * tags:
 *   name: groupes
 */
/**
 * @swagger
 * /Groupe:
 *  get:
 *    description: Use to request all groupes
 *    tags: [groupes]
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
 * /GetGroupById:
 *  get:
 *    description: Use to request groupes By Id
 *    tags: [groupes]
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
 *      '500':
 *        description: SQL_ERROR /
 */
/**
/**
 * @swagger
 * /DeleteGroupe:
 *  post:
 *    description: Use to Delet groupes
 *    tags: [groupes]
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
 *        description: DATA_MISSING / EMPLOYE_NOT_FOUND
 *      '500':
 *        description: SQL_ERROR /
 */
/**
 * @swagger
 * /UpdateGroup:
 *  put:
 *    description: Use to Updat groupes
 *    tags: [groupes]
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
 *        description: DATA_MISSING / EMPLOYE_NOT_FOUND
 *      '500':
 *        description: SQL_ERROR /
 */