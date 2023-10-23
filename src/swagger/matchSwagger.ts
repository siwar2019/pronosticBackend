/**
 * @swagger
 * tags:
 *   name: matchs
 */
/**
 * @swagger
 * /GETMATCHS:
 *  get:
 *    description: Use to request all matchs
 *    tags: [matchs]
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
 *                      MatchId:
 *                          type: integer
 *                      Equipe1:
 *                          type: string
 *                      Equipe2:
 *                          type: string
 *      '500':
 *        description: SQL_ERROR /
 */
/**
/**
 * /**
 * @swagger
 * /GetMatchById:
 *  get:
 *    description: Use to request matchs By Id
 *    tags: [matchs]
 *    parameters:
 *       - name: MatchId
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
 * /DeleteMatch:
 *  post:
 *    description: Use to Delet matchs
 *    tags: [matchs]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                MatchId:
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
 *        description: DATA_MISSING / EQUIPE_NOT_FOUND
 *      '500':
 *        description: SQL_ERROR /
 */
/**
 * @swagger
 * /UpdateMatch:
 *  put:
 *    description: Use to Updat matchs
 *    tags: [matchs]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                MatchId:
 *                   type: integer
 *                Equipe1:
 *                   type: string
 *                Equipe2:
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
 *        description: DATA_MISSING / EQUIPE_NOT_FOUND
 *      '500':
 *        description: SQL_ERROR /
 */