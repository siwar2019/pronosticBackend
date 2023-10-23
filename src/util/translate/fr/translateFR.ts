export class URLs {
  public static readonly LOGIN: string = "/Login";
  public static readonly REGISTER: string = "/Register";
  public static readonly ADDEMPLOYEE: string = "/AddEmployee";
  public static readonly CURRENTUSER: string = "/current-user";
  public static readonly ACTIVEACCOUNTADMIN: string =
    "/active-account-by-admin";
  public static readonly DESACTIVEACCOUNTADMIN: string =
    "/desactive-account-by-admin";
  public static readonly UPDATEACCOUNTBYPARTNER: string =
    "/update-account-by-partner";
  public static readonly LOGOUT: string = "/logout-account";
  public static readonly GETUSER: string = "/get-all-partners";
  public static readonly GETALLEMPLOYEE: string = "/get-all-employee";
  public static readonly GET_PARTNER_EVENTS: string =
    "/get-partner-events-by-Id";
  public static readonly GET_GROUPES: string = "/get-groupes";

  public static readonly GET_TEAMS: string = "/get-all-teams";
  public static readonly GetEquipeById: string = "/EquipesById";
  public static readonly DeleteEquipe: string = "/DeleteEq";
  public static readonly UpdateEquipe: string = "/UpdateEq";
  public static readonly GETEQUIPE_BY_GROUP: string = "/GETEQUIPE_BY_GROUP";

  public static readonly CREATEEMPLOYEE: string = "/CreateEmployee";
  public static readonly GETEMPLOYEE: string = "/getAllEmployee";
  public static readonly GETEMPLOYEEBYID: string = "/EmployeeById";
  public static readonly DELETEMPLOYEE: string = "/DeletEmployee";
  public static readonly UpdateEmploye: string = "/UpdatEmploye";

  public static readonly GETEVENT: string = "/Events";
  public static readonly GetEventById: string = "/GetEventById";
  public static readonly DeleteEvent: string = "/DeleteEvent";
  public static readonly UpdateEvent: string = "/UpdateEvent";

  public static readonly GEtGROUPE: string = "/Groupe";
  public static readonly GetGroupById: string = "/GetGroupById";
  public static readonly DeleteGroup: string = "/DeleteGroupe";
  public static readonly UpdateGroup: string = "/UpdateGroup";

  public static readonly GETCATEGORIES: string = "/Categories";
  public static readonly GetCategorieById: string = "/GetCategorieById";
  public static readonly DeleteCategory: string = "/DeleteCategory";
  public static readonly UpdateCategory: string = "/UpdateCategory";

  public static readonly GETMATCHS: string = "/GETMATCHS";
  public static readonly GetMatchById: string = "/GetMatchById";
  public static readonly DeleteMatch: string = "/DeleteMatch";
  public static readonly UpdateMatch: string = "/UpdateMatch";

  public static readonly CREATEPARTNER: string = "/createPartner";
  public static readonly GETPARTNER: string = "/PartnerGetAll";
  public static readonly GetPARTNERById: string = "/GetPartnerById";
  public static readonly DELETEPARTNER: string = "/DeletePartner";
  public static readonly UpdatePartner: string = "/UpdatePartner";

  public static readonly GETSCORE: string = "/Score";
  public static readonly GetScoreById: string = "/GetScoreById";
  public static readonly DELETESCORE: string = "/DeleteScore";
  public static readonly UpdateScore: string = "/UpdateScore";
  public static readonly CREATE_SCORE: string = "/create-score";
  public static readonly UPDATE_SCORE: string = "/update-score";

  public static readonly GET_ALL_EVENT_BY_CATEGORY: string =
    "/get-all-events-by-category";
  public static readonly ADD_EVENTS_TO_PARTNER: string =
    "/add-events-to-partner";
  public static readonly ADD_EVENT: string = "/add-event";
}
export class MSG {
  public static readonly CREDENTIALS_REQUIRED: string =
    "EMAIL ET MOT DE PASSE REQUIRED";
  public static readonly DATA_MISSING: string = "DATA_MISSING";
  public static readonly USER_IS_NOT_ACTIVE: string = "Account not active";
  public static readonly CORRECT_CREDENTIALS: string = "User connected";
  public static readonly WRONG_CREDENTIALS: string = "wrong email or password";
  public static readonly CODE_EXPIRED: string = "CODE_EXPIRED";
  public static readonly SQL_ERROR: string = "SQL_ERROR";
  public static readonly EMAIL_EXISTS: string =
    "Email already exits in dataBase";
  public static readonly EMAIL_EXISTS_FOR_EMPLOYEE: string =
    "Some Emails already exits, check red color";
  public static readonly USER_CREATED: string = "USER_CREATED";
  public static readonly DRAW_CREATED: string = "DRAW_CREATED";
  public static readonly USER_NOT_FOUND: string = "USER_NOT_FOUND";
  public static readonly EMPLOYEE_NOT_FOUND: string = "EPMLOYEE_NOT_FOUND";
  public static readonly PARTNER_NOT_FOUND: string = "PARTNER_NOT_FOUND";
  public static readonly PARTNER_NOT_VALID: string = "PARTNER_NOT_VALID";
  public static readonly ADMIN_NOT_FOUND: string = "ADMIN_NOT_FOUND";
  public static readonly NOT_FOUND: string = "NOT_FOUND";
  public static readonly EQUIPE_NOTFIND: string = "EQUIPE_NOT_FOUND";
  public static readonly DELETED: string = "EQUIPE_DELETED";
  public static readonly NOTfIND: string = "NOTfIND";
  public static readonly UPDATED_SUCCESUFULLY: string = "UPDATED_SUCCESUFULLY";
  public static readonly UPDATED_ERROR: string = "UPDATED_ERROR";
  public static readonly EMPLOYE_NOTFIND: string = "EMPLOYE_NOT_FOUND";
  public static readonly MATCH_NOTFIND: string = "MATCH_NOT_FOUND";
  public static readonly MATCH_HAVE_SCORE: string = "MATCH_HAVE_SCORE";
  public static readonly MATCH_DONT_HAVE_SCORE_TO_UPDATE: string =
    "MATCH_DONT_HAVE_SCORE_TO_UPDATE";
  public static readonly DELETEDEMPLOYE: string = "EMPLOYE_DELETED";
  public static readonly DELETED_SUCCUSSFULLY: string = "DELETED_SUCCUSSFULLY";
  public static readonly PARTNER_NOTFIND: string = "PARTNER_NOT_FOUND";
  public static readonly DELETEDPARTNER: string = "PARTNER_DELETED";
  public static readonly DELETEDSCORE: string = "SCORE_DELETED";
  public static readonly SCORE_NOTFIND: string = "SCORE_NOT_FOUND";
  public static readonly MAXIMUM_NUMBER: string =
    "MAXIMUM NUMBER OF EMPLOYEE IS REACHED";
  public static readonly EVENTS_ADDED: string =
    "Les évènemts sont bien ajoutés";
  public static readonly EVENT_EXISTS: string = "Ce évènement déjà existe";
  public static readonly EVENT_CREATED: string = "Evènement crée";
  public static readonly DESACTIVE_ACCOUNT: string = "DESACTIVE_ACCOUNT";
  public static readonly CREATE_SUCCESUFULLY: string = "CREATE_SUCCESUFULLY";
  public static readonly CREATE_ERROR: string = "CREATE_ERROR";
  public static readonly UPLOAD_SUCSSES: string = "UPLOAD_SUCSSES";
  public static readonly UPDATE_SUCSSES: string = "UPDATE_SUCSSES";
  public static readonly UPLOAD_ERROR: string = "UPLOAD_ERROR";
  public static readonly READ_ERROR: string = "READ_ERROR";
  public static readonly GROUPES_ADDED: string = "GROUPES_ADDED";
  public static readonly EVENT_NOT_BUYED: string = "EVENT_NOT_BUYED";
  public static readonly YOU_PREDICTED: string = "YOU_PREDICTED";
  public static readonly YOU_CANT_PREDICTED: string = "YOU_CAN'T_PREDICTE";
  public static readonly YOU_CANT_UPDATE_PREDICATE: string =
    "YOU_CAN'T_UPDATE_PREDICATE";
  public static readonly YOU_CANT_UPDATE: string = "YOU_CAN'T_UPDATE";
  public static readonly CHECK_EMAIL: string = "Check Your Email";
  public static readonly INVALID_SCORE: string = "INVALID_SCORE";
  public static readonly VERIFY_DATA: string = "VERIFY_DATA";
  public static readonly MUST_HAVE_ONE_EVENT: string = "MUST HAVE ONE EVENT";
  public static readonly YOU_ALREADY_USE_THIS_JOKER: string =
    "YOU ALREADY USE THIS JOKER!";
  public static readonly INVALID_POINTS: string = "INVALID POINTS";
  public static readonly EVENT_NOT_FOUND: string = "EVENT NOT FOUND";
}
