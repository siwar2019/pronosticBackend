/**
 * @swagger
 * tags:
 *   name: Employee
 */
/**
 * @swagger
 * /EmployeeGetAll:
 *  get:
 *    description: Use to request all Employee
 *    tags: [Employee]
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
 *                      EmployeId:
 *                          type: integer
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *      '500':
 *        description: SQL_ERROR /
 */
/**
 * @swagger
 * /CreateEmployee:
 *  post:
 *    description: Use to Create Employee
 *    tags: [Employee]
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
 *                firstName:
 *                   type: string
 *                lastName:
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
 *        description: DATA_MISSING / EMAIL_EXISTS
 *      '500':
 *        description: SQL_ERROR /
 */
/**
 * @swagger
 * /DeletEmployee:
 *  post:
 *    description: Use to Delet Employee
 *    tags: [Employee]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                EmployeId:
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
/**
 * @swagger
 * /UpdatEmploye:
 *  put:
 *    description: Use to Updat Employe
 *    tags: [Employee]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *             type: object
 *             properties:
 *                EmployeId:
 *                   type: integer
 *                Email:
 *                   type: string
 *                firstName:
 *                   type: string
 *                LastName:
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