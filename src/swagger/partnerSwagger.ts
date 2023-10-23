// /**
//  * @swagger
//  * tags
//  *  name:Partner
//  */
// /**
//  * @swagger
//  * /PartnerGetAll:
//  *  get:
//  *    description: Use to request all Partner
//  *    tags: [Partner]
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *        content:
//  *           application/json:
//  *              schema:
//  *                 type: array
//  *                 items:
//  *                  type: object
//  *                  properties:
//  *                      PartnerId:
//  *                          type: integer
//  *                      Email:
//  *                          type: string
//  *                      Name:
//  *                          type: string
//  *      '500':
//  *        description: SQL_ERROR /
//  */
// /**
// /**
//  * /**
//  * @swagger
//  * /GetPartnerById:
//  *  get:
//  *    description: Use to request Partner By Id
//  *    tags: [Partner]
//  *    parameters:
//  *       - name: PartnerId
//  *         in: query
//  *         schema:
//  *           type: integer
//  *         required: true
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *        content:
//  *           application/json:
//  *              schema:
//  *                 type: object
//  *                 properties:
//  *                      success:
//  *                          type: boolean
//  *                      message:
//  *                          type: string
//  *      '400':
//  *        description: ENOT_FOUND / DATA_MISSING /
//  */
// /**
// /**
//  * @swagger
//  * /UpdatePartner:
//  *  put:
//  *    description: Update Partner
//  *    tags: [Partner]
//  *    requestBody:
//  *     required: true
//  *     content:
//  *       application/json:
//  *          schema:
//  *             type: object
//  *             properties:
//  *                PartnerId:
//  *                   type: integer
//  *                Email:
//  *                   type: string
//  *                Name:
//  *                   type: string
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *        content:
//  *           application/json:
//  *              schema:
//  *                 type: object
//  *                 properties:
//  *                      success:
//  *                          type: boolean
//  *                      message:
//  *                          type: string
//  *      '400':
//  *        description: ENOT_FOUND / DATA_MISSING /
//  *      '500':
//  *        description: SQL_ERROR /
//  */
// /**
//  * @swagger
//  * /DeletePartner:
//  *  post:
//  *    description: Delete Partner
//  *    tags: [Partner]
//  *    requestBody:
//  *     required: true
//  *     content:
//  *       application/json:
//  *          schema:
//  *             type: object
//  *             properties:
//  *                PartnerId:
//  *                   type: integer
//  *    responses:
//  *      '200':
//  *        description: A successful response
//  *        content:
//  *           application/json:
//  *              schema:
//  *                 type: object
//  *                 properties:
//  *                      success:
//  *                          type: boolean
//  *                      message:
//  *                          type: string
//  *      '400':
//  *        description: ENOT_FOUND / DATA_MISSING /
//  *      '500':
//  *        description: SQL_ERROR /
//  */
