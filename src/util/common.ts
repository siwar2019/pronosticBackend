export class URLs {
  public static readonly LOGIN: string = "/login";
  public static readonly LOGIN_DEMO: string = "/login-demo";
  public static readonly REGISTER: string = "/register";
  public static readonly DESACTIVE_ACCOUNT: string = "/desactive-account";
  public static readonly ACTIVATE_ACCOUNT: string = "/activate-account";

  //Partner
  public static readonly ACTIVATE_ACCOUNT_PARTNER: string =
    "/activate-account-partner";
  public static readonly GET_PARTNERS: string = "/get-all-partners";
  public static readonly GET_PARTNER_BY_ID: string = "/get-partner-by-id";
  public static readonly GET_EMPLOYEE_PARTNER: string = "/get-employee-partner";
  public static readonly GET_CURRENTLY_PARTNER: string = "/get-current-partner";
  public static readonly DELETE_PARTNER: string = "/delete-partner";
  public static readonly UPDATE_PARTNER: string = "/update-partner";
  public static readonly GET_PARTNERS_BY_EVENTS: string =
    "/get-all-partners-by-events";

  //Employe
  public static readonly CREATE_EMPLOYEE: string = "/create-employee";
  public static readonly DELETE_EMPLOYEE: string = "/delete-employee";
  public static readonly UPDATE_EMPLOYEE: string = "/update-employee";
  public static readonly UPDATE_EMPLOYEE_PASSWORD: string =
    "/update-employee-password";
  public static readonly GET_EMPLOYEES: string = "/get-all-employes";
  public static readonly ACTIVATE_ACCOUNT_EMPLOYEE: string =
    "/activate-account-employee";
  public static readonly STATISTICS_EMPLOYEE_DAILY_POINTS: string =
    "/get-daily-points-employee";
  public static readonly STATISTICS_EMPLOYEE_DAILY_RANG: string =
    "/get-daily-rang-employee";
  public static readonly STATISTICS_EMPLOYEE_DAILY_POINTS_DIFFERENCE: string =
    "/get-daily-points-difference";
  public static readonly STATISTICS_EMPLOYEE_POINTS_DETAILS: string =
    "/get-employee-points-details";

  //User
  public static readonly GET_USERS: string = "/get-all-users";
  public static readonly GET_CURRENT_USER: string = "/get-current-user";
  public static readonly GET_USER_BY_ID: string = "/get-user-by-id";
  public static readonly UPDATE_USER: string = "/update-user";
  public static readonly UPDATE_PROFILE: string = "/update-profile";
  public static readonly DELETE_USER: string = "/delete-user";
  public static readonly UPDATE_PASSWORD: string = "/update-password";
  public static readonly FORGOT_PASSWORD: string = "/forgot-password";
  public static readonly CHANGE_PASSWORD: string = "/change-password";
  public static readonly GET_COMPANY: string = "/get-company";
  public static readonly GET_PARTNER: string = "/get-partner";

  //Categorie
  public static readonly GET_CATEGORIES: string = "/get-all-categories";
  public static readonly GET_CATEGORY_BY_ID: string = "/get-category-by-id";
  public static readonly DELETE_CATEGORY: string = "/delete-category";
  public static readonly UPDATE_CATEGORY: string = "/update-category";
  public static readonly CREATE_CATEGORY: string = "/create-category";

  //Event
  public static readonly CREATE_EVENT: string = "/create-event";
  public static readonly GET_EVENTS: string = "/get-all-events";
  public static readonly GET_EVENT_BY_ID: string = "/get-event-by-id";
  public static readonly GET_EVENT_BY_CATEGORIE: string =
    "/get-event-by-categorie";
  public static readonly GET_EVENT_BY_CATEGORIE_FOR_ADMIN: string =
    "/get-event-by-categorie-for-admin";
  public static readonly GET_EVENT_FOR_ADMIN_BY_CATEGORIE: string =
    "/get-event-for-admin-by-categorie";
  public static readonly GET_EVENT_STATISTIQUE_CORRECT_SCORE_FOR_PARTNER: string =
    "/get-event-statistique-correct-score-for-partner";
  public static readonly DELETE_EVENT: string = "/delete-event";
  public static readonly ADD_EVENT_TO_PARTNER: string = "/add-event-to-partner";
  public static readonly GET_EVENTS_BY_PARTNER: string =
    "/get-events-by-partner";
  public static readonly UPDATE_EVENT: string = "/update-event";
  public static readonly GET_PARTNER_BY_EVENTS_FOR_ADMIN: string =
    "/get-partner-by-events-for-admin";
  public static readonly GET_EVENT_BY_CATEGORIE_FOR_PARTNER_BY_ADMIN: string =
    "/get-event-by-categorie-for-partner-by-admin";
  public static readonly SWITCH_ACTIVE_EVENT_FOR_PARTNER: string =
    "/switch-active-event-for-partner";
  public static readonly GET_PARTNER_EVENT: string = "/get-partner-event";
  public static readonly ACTIVED_EVENT_PARTNER: string =
    "/actived-partner-event";
  public static readonly DESACTIVED_EVENT_PARTNER: string =
    "/desactived-partner-event";
  public static readonly GET_EVENT_BY_CATEGORIE_ADMIN: string =
    "/get-event-buy-for-admin-by-categorie";
  public static readonly DELETE_PARTNER_EVENT: string = "/delete-partner-event";
  public static readonly GET_ACTIVE_EVENTS_FOR_PARTNER: string =
    "/get-active-events-for-partner";
  public static readonly GET_EVENT_BY_ID_FOR_EMPLOYEE: string =
    "/get-event-by-id-for-employee";
  public static readonly ACTIVE_DESACTIVE_QUALIFICATION_FOR_PARTNER: string =
    "/active-desactive-qualification-partner";
  public static readonly GET_ACTIVE_EVENT_BY_CATEGORIE_FOR_EMPLOYEE: string =
    "/get-active-event-by-categorie-for-employee";
  public static readonly GET_CALCULATED_EVENTS_FOR_PARTNER: string =
    "/get-calculated-events-for-partner";
  public static readonly SWITCH_HIDDEN_EVENT_FOR_PARTNER: string =
    "/switch-hidden-event-for-partner";
  public static readonly GET_ALL_PARTNERS_EVENTS: string =
    "/get-all-partners-events";
  public static readonly GET_EVENT_QUALIFICATION_FOR_ADMIN_BY_CATEGORIE: string =
    "/get-event-qualification-for-admin-by-categorie";

  public static readonly ARCHIVED_EVENT: string = "/archived-events-by-admin";
  //Equipe
  public static readonly UPLOAD_FILE: string = "/upload";
  public static readonly CREATE_EQUIPES: string = "/create-equipes";
  public static readonly GET_EQUIPES: string = "/get-all-equipes";
  public static readonly CREATE_EQUIPES_Admin: string = "/create-equipes-admin";

  //Groupe
  public static readonly CREATE_GROUPES: string = "/create-groupes";
  public static readonly GET_GROUPES: string = "/get-all-groupes";
  public static readonly GET_GROUPES_BY_EVENT: string = "/get-groupes-by-id";
  public static readonly GET_GROUPE_BY_ID_EVENT: string =
    "/get-groupe-by-id-Event";
  public static readonly DELETE_GROUPE: string = "/delete-groupe";
  public static readonly ADD_EQUIPE_TO_GROUPE: string = "/get-equipe-to-groupe";
  public static readonly UPDATE_GROUPE: string = "/update-groupe";
  public static readonly GET_GROUPE_EQUIPE: string = "/get-groupe-equipe";
  public static readonly GET_GROUPE_EQUIPE_FOR_ADMIN: string =
    "/get-groupe-equipe-for-admin";
  public static readonly CREATE_GROUPES_Admin: string = "/create-groupes-admin";
  public static readonly CREATE_MATCH_GROUPE_Admin: string =
    "/create-match-groupes-admin";
  //Match
  public static readonly CREATE_MATCHES: string = "/create-matches";
  public static readonly CREATE_MATCHES_GROUPES: string =
    "/create-matches-groupes";
  public static readonly GetMatchById: string = "/get-match-by-id";
  public static readonly GET_MATCH_BY_EVENT: string = "/get-match-by-event";
  public static readonly GET_MATCH_BY_EVENT_FOR_ADMIN: string =
    "/get-match-by-event-for-admin";
  public static readonly GET_COEFF_MATCH_BY_EVENT_FOR_ADMIN: string =
    "/get-coeff-match-by-event-for-admin";
  public static readonly GET_MATCH_BY_EVENT_FOR_ADD_DATES: string =
    "/get-match-by-event-for-add-dates";
  public static readonly GET_MATCH_BY_GROUPE: string = "/get-match-by-groupe";
  public static readonly GET_MATCH_BY_EVENT_FOR_EMPLOYEE: string =
    "/get-match-by-event-for-employee";
  public static readonly GET_MATCH_BY_EVENT_FOR_PARTNER: string =
    "/get-match-by-event-for-partner";
  public static readonly GET_MATCH_BY_ID_FOR_EMPLOYEE: string =
    "/get-match-by-id-for-employee";
  public static readonly GET_MATCH_BY_ID_FOR_ADMIN: string =
    "/get-match-by-id-for-admin";
  public static readonly ADD_DATE_TO_MATCHS: string = "/add-date-to-matchs";
  public static readonly UPDATE_DATE_MATCH: string = "/update-date-match";
  public static readonly UPDATE_COEFF_MATCH: string = "/update-coeff-match";
  public static readonly DELETE_MATCH: string = "/delete-match";
  public static readonly UPDATE_MATCH_EQUIPE: string = "/update-match-equipe";

  public static readonly GET_MATCH_NOTIFICATION_BY_EVENTS_FOR_EMPLOYEE: string =
    "/get-match-notification-by-events-for-employee";
  //Pronostic
  public static readonly CREATE_PRONOSTIC: string = "/create-pronostic";
  public static readonly UPDATE_PRONOSTIC: string = "/update-pronostic";
  public static readonly INITIALIZATION_PRONOSTIC: string =
    "/initialization-pronostic";
  public static readonly ADD_INITIAL_VALUE_TO_EMPLOYEE: string =
    "/add-initial-value-to-employee";
  public static readonly GET_EMPLOYEE_DAILY_ACTIONS: string =
    "/get-employee-daily-actions";
  public static readonly COMPARAISON_PRONOSTICS: string = "/comparaison-pronostics"

  //Draw
  public static readonly CREATE_DRAW_BY_EMPLOYEE: string =
    "/create-draw-by-employee";
  public static readonly CREATE_DRAW_BY_ADMIN_ROUND_ONE: string =
    "/create-draw-by-admin-round-one";
  public static readonly CREATE_DRAW_BY_ADMIN_ROUND_TWO: string =
    "/create-draw-by-admin-round-two";
  public static readonly CREATE_DRAW_BY_ADMIN_ROUND_THREE: string =
    "/create-draw-by-admin-round-three";
  public static readonly CREATE_DRAW_BY_ADMIN_ROUND_FOUR: string =
    "/create-draw-by-admin-round-four";
  public static readonly CREATE_DRAW_BY_ADMIN_ROUND_FIVE: string =
    "/create-draw-by-admin-round-five";
  public static readonly GET_DRAW_BY_EMPLOYEE: string = "/get-draw-by-employee";
  public static readonly GET_DRAW_BY_ADMIN: string = "/get-draw-by-admin";
  public static readonly GET_CORRECT_DRAW: string = "/get-correct-draw";
  public static readonly GET_TOTAL_DRAW_SCORE_EMPLOYEE_BY_EVENT: string =
    "/get-total-draw-score-employee-by-event";
  public static readonly GET_TOTAL_DRAW_SCORE_EMPLOYEE_BY_EVENT_BY_ADMIN: string =
    "/get-total-draw-score-employee-by-event-by-admin";
  public static readonly CREATE_DRAW_BY_EMPLOYEE_16_TEAMS: string =
    "/create-draw-by-employee-16teams";
  public static readonly CREATE_DRAW_BY_ADMIN_16_ROUND_ONE: string =
    "/create-draw-by-admin-round-one-16-team";
  public static readonly CREATE_DRAW_BY_ADMIN_16_ROUND_TWO: string =
    "/create-draw-by-admin-round-two-16-team";
  public static readonly CREATE_DRAW_BY_ADMIN_16_ROUND_THREE: string =
    "/create-draw-by-admin-round-three-16-team";
  public static readonly CREATE_DRAW_BY_ADMIN_16_ROUND_FOUR: string =
    "/create-draw-by-admin-round-four-16-team";
  public static readonly CREATE_DRAW_BY_EMPLOYEE_8_TEAMS: string =
    "/create-draw-by-employee-8teams";
  public static readonly CREATE_DRAW_BY_ADMIN_8_ROUND_ONE: string =
    "/create-draw-by-admin-round-one-8-team";
  public static readonly CREATE_DRAW_BY_ADMIN_8_ROUND_TWO: string =
    "/create-draw-by-admin-round-two-8-team";
  public static readonly CREATE_DRAW_BY_ADMIN_8_ROUND_THREE: string =
    "/create-draw-by-admin-round-three-8-team";
  public static readonly GET_SETTING_DRAW_8_TEAMS_BY_ADMIN: string =
    "/get-setting-draw-8-teams-by-admin";
  public static readonly GET_SETTING_DRAW_8_TEAMS_BY_EMPLOYEE: string =
    "/get-setting-draw-8-teams-by-employee";
  public static readonly GET_SETTING_DRAW_32_TEAMS_BY_EMPLOYEE: string =
    "/get-setting-draw-32-teams-by-employee";
  public static readonly GET_SETTING_DRAW_16_TEAMS_BY_EMPLOYEE: string =
    "/get-setting-draw-16-teams-by-employee";
  public static readonly UPDATE_SETTING_DRAW_8_TEAMS_BY_ADMIN: string =
    "/update-setting-draw-8-teams-by-admin";
  public static readonly UPDATE_SETTING_DRAW_32_TEAMS_BY_ADMIN: string =
    "/update-setting-draw-32-teams-by-admin";
  public static readonly UPDATE_SETTING_DRAW_16_TEAMS_BY_ADMIN: string =
    "/update-setting-draw-16-teams-by-admin";
  public static readonly GET_SETTING_DRAW_32_TEAMS_BY_ADMIN: string =
    "/get-setting-draw-32-teams-by-admin";
  public static readonly GET_SETTING_DRAW_16_TEAMS_BY_ADMIN: string =
    "/get-setting-draw-16-teams-by-admin";
  public static readonly CREATE_SETTING_DRAW_8_TEAMS_BY_ADMIN: string =
    "/create-setting-draw-8-teams-by-admin";
  public static readonly CREATE_SETTING_DRAW_16_TEAMS_BY_ADMIN: string =
    "/create-setting-draw-16-teams-by-admin";
  public static readonly CREATE_SETTING_DRAW_32_TEAMS_BY_ADMIN: string =
    "/create-setting-draw-32-teams-by-admin";

  public static readonly GET_PRONOSTICS_EMPLOYEE: string =
    "/get-pronostics-employee";
  public static readonly GET_PRONOSTIC_EMPLOYEE: string =
    "/get-pronostic-employee";
  public static readonly GET_PRONOSTICS_EMPLOYEE_FOR_PARTNER: string =
    "/get-pronostics-employee-for-partner";
  public static readonly GET_PRONOSTICS_EMPLOYEES_FOR_PARTNER: string =
    "/get-pronostics-employees-for-partner";
  public static readonly GET_TOTAL_PRONOSTICS_EMPLOYEE_BY_EVENT: string =
    "/get-total-pronostics-employee-by-event";
  public static readonly GET_POINTS_PRONOSTICS_EMPLOYEE_BY_EVENT: string =
    "/get-points-pronostics-employee-by-event";
  public static readonly GET_POINTS_PRONOSTICS_EMPLOYEE_BY_EVENT_ADMIN: string =
    "/get-points-pronostics-employee-by-event-admin";

  public static readonly GET_PRONOSTICS_EMPLOYEE_FOR_PARTNER_BY_ADMIN: string =
    "/get-pronostics-employee-for-partner-by-admin";

  public static readonly GET_ALL_MATCH_BY_EVENT_FOR_ADMIN: string =
    "/get-all-match-by-event-for-admin";

  public static readonly GET_TOTAL_PRONOSTICS_ADMIN_BY_PARTNER_BY_EVENTS: string =
    "/get-total-pronostics-admin-by-partner-by-event";

  public static readonly GET_TOTAL_PRONOSTICS_EMPLOYEE_BY_EVENT_FOR_PARTNER_BY_ADMIN: string =
    "/get-total-pronostics-employee-by-event-for-partner-by-admin";
  public static readonly GET_PRONOSTICS_EMPLOYEES_FOR_PARTNER_FOR_PARTNER_BY_ADMIN: string =
    "/get-pronostics-employees-for-partner-for-partner-by-admin";
  public static readonly GET_TOTALE_PRONOSTICS_BY_MATCH_FOR_ADMIN: string =
    "/get-totale-pronostics-by-match-for-admin";
  public static readonly GET_TOTAL_PRONOSTICS_EMPLOYEE: string =
    "/get-total-pronostics-employee";
  public static readonly GET_EACH_EVENT_PRONOSTICS_EMPLOYEE_FOR_PARTNER: string =
    "/get-each-event-pronostics-employee";

  public static readonly GET_MATCHS_BY_IDS: string = "/get-matchs-by-ids";
  //// commercial
  public static readonly CREATE_COMMERCIAL: string = "/create-commercial";
  public static readonly GET_ALL_COMMERCIAL: string = "/get-all-commercial";
  public static readonly UPDATE_ACCOUNT_COMMERCIAL: string =
    "/update-account-commercial";
  public static readonly CREATE_PARTNER_BY_COMMERCIAL: string =
    "/create-partner-by-commercial";
  public static readonly GET_PARTNER_BY_COMMERCIAL: string =
    "/get-partner-by-commercial";
  public static readonly UPDATE_ACCOUNT_PARTNER_BY_COMMERCIAL: string =
    "/update-account-partner-by-commercial";
  public static readonly CALCUL_CASHOUT_COMMERCIAL: string =
    "/calcul-cashout-commercial";
  public static readonly GET_EMPLOYEE_COMMERCIAL: string =
    "/get-employee-commercial";

  public static readonly CREATE_SETTINGS_PRICE: string = "/Add-settings-users";

  public static readonly UPDATE_PRICE_USER: string = "/update-price-users";

  public static readonly GET_PRICE_USER: string = "/get-price-users";

  public static readonly GET_HISTORIQUE_COMMERCIAL: string =
    "/get-historique-users";
  public static readonly REQUEST_CHASH_OUT: string = "/request-chasout";

  public static readonly GET_REQUEST_CASHOUT: string = "/get-resquest-cashout";

  public static readonly PAYMENT_COMMERCIAL: string = "/payment-commercial";

  public static readonly GET_EACH_EVENT_PRONOSTICS_EMPLOYEE_FOR_EMPLOYEE: string =
    "/get-each-event-pronostics-employee-for-employee";
  public static readonly GET_ALL_PRONOSTICS_EMPLOYEE_FOR_PARTNER: string =
    "/get-all-pronostics-employee-for-partner";
  public static readonly GET_ALL_PRONOSTICS_EMPLOYEES_FOR_PARTNER: string =
    "/get-all-pronostics-history-employees-for-partner";

  //Options
  public static readonly GET_EMPLOYEE_OPTIONS: string = "/get-employee-options";
  public static readonly CREATE_PRONOSTIC_SUPER_PRONOSTIC: string =
    "/create-pronostic-with-super";
  public static readonly CREATE_PRONOSTIC_FORGOT_SAVE: string =
    "/create-pronostic-forgot-save";
  public static readonly UPDATE_PRONOSTIC_SUPER_PRONOSTIC: string =
    "/update-pronostic-with-super";
  public static readonly CREATE_PRONOSTIC_DOUBLE_SCORE: string =
    "/create-pronostic-with-double-score";
  public static readonly UPDATE_UNUSED_DOUBLE_SCORE_JOKER: string =
    "/update-unused-double-score-joker";
  public static readonly UPDATE_PRONOSTIC_DOUBLE_SCORE: string =
    "/update-pronostic-with-double-score";
  public static readonly CREATE_PRONOSTIC_DOUBLE_SCORE_FORGOT_SAVE: string =
    "/create-pronostic-with-double-forgot";
  public static readonly CREATE_PRONOSTIC_DOUBLE_SCORE_SUPER: string =
    "/create-pronostic-with-double-super";
  public static readonly UPDATE_PRONOSTIC_DOUBLE_SCORE_SUPER_PRONOSTIC: string =
    "/update-pronostic-with-double-and-pronostic";

  //Solde
  public static readonly CREATE_SOLDE_EMPLOYEE: string =
    "/create-solde-employee";
  public static readonly CREATE_SOLDE_PARTNER: string = "/create-solde-partner";
  public static readonly CREATE_SOLDE: string = "/create-solde-partner";
  public static readonly ASSIGNMENT_SOLDE: string =
    "/assignment-solde-to-employee";
  public static readonly GET_PARTNER_SOLDE: string = "/get-partner-solde";
  public static readonly GET_EMPLOYEE_SOLDE: string = "/get-employee-solde";
  //quizs
  public static readonly CREATE_QUIZ:string="/create-quiz" ;
  public static readonly GET_QUIZ:string="/get-list-quiz" ;
  public static readonly CREATE_QUESTION_QUIZ:string="/create-question-quiz" ;
  public static readonly CREATE_QUESTION_QUIZ_single:string="/create-question-quiz-single" ;
  public static readonly GET_Questions:string="/get-list-questions" ;
  public static readonly GET_RESPONSES:string="/get-list-reponses" ;
  public static readonly UPDATE_SCORE_QUIZ:string="/update-score-quiz" ;

  



}
