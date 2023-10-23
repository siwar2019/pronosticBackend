/**
 * @swagger
 * tags
 *  name:Equipes
 */
/**
 * @swagger
 * /Equipes:
 *  get:
 *    description: Use to request all Equipes
 *    tags: [Equipes]
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
 * /**
 * @swagger
 * /EquipesById:
 *  get:
 *    description: Use to request Equipes By Id
 *    tags: [Equipes]
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
 * /UpdateEq:
 *  put:
 *    description: Update Equipes
 *    tags: [Equipes]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                Id:
 *                   type: string
 *                Designation:
 *                   type: string
 *                FlagPays:
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
 * /DeleteEq:
 *  post:
 *    description: Delete Equipes
 *    tags: [Equipes]
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
