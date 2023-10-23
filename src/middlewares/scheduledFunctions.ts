import moment from "moment";
import CronJob from "node-cron";
import { Op } from "sequelize";
import mail from "../nodeMailer/mail";
import { DailyReport, WarningInPronostics } from "../nodeMailer/welcome";
import { sequelize } from "../sequelize";
import { Equipes } from "../sqlModels/equipe";
import { Groupes } from "../sqlModels/groupes";
import { Matchs } from "../sqlModels/Matchs";
import { User } from "../sqlModels/user";
import { eleminateHours } from "../util/hours";

const initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule("0 0 0 * * *", async () => {
    console.log("I'm executed on a schedule!");
    let date = moment(eleminateHours(new Date(), 24, 0)).format("YYYY-MM-DD");
    let pronosticsEmployee: any[] = [];
    try {
      let employees = await User.findAll({
        where: {
          role: "employee",
          is_active: true,
        },
        attributes: ["id", "email"],
      });
      const groupesEvent = await Groupes.findAll({
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });
      const grIds = groupesEvent.map((gr) => gr.id);
      const matches = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            attributes: ["name"],
          },
        ],
      });

      let employeesIds: number[] = employees.map((employeeId) => {
        return employeeId.id;
      });

      let counter = 0;
      let historyTable: any[] = [];
      const promise = new Promise<void>((resolve) => {
        employeesIds.forEach((employeeId: number) => {
          sequelize
            .query(
              "SELECT equipe1, equipe2, status, options, match_id as matchs, employee_id as employee, createdAt FROM `pronostics_history` where CAST(`createdAt` AS DATE) = $date AND `employee_id` = $employeeId ",
              {
                bind: {
                  employeeId,
                  date,
                },
              }
            )
            .then((pronosticHistory) => {
              historyTable = historyTable.concat(pronosticHistory[0]);
              counter++;
              if (employeesIds.length === counter) resolve();
            })
            .catch((error) => {
              console.log("error", error);
            });
        });
      });
      promise.then(async () => {
        historyTable.map((history) => {
          employees.map((employee) => {
            if (history.employee === employee.id)
              history.employee = employee.email;
          });
          matches.map((match) => {
            if (history.matchs === match.id)
              history.matchs = match.equipes.map((equipe) => equipe.name);
          });

          if (history.status === "create")
            history.status = "Nouvelle pronostic";
          else if (history.status === "update") history.status = "Modification";

          switch (history.options) {
            case "double_score":
              history.options = "Score Double";
              break;
            case "forgot_save":
              history.options = "Forgot Save";
              break;
            case "double_score&super_pronostic":
              history.options = "Super Pronostic & Score Double";
              break;
            case "super_pronostic":
              history.options = "Super Pronostic";
              break;
            case "double_score&forgot_save":
              history.options = "Forgot Save & Score Double";
              break;
            default:
              history.options = "Aucune option";
          }
        });

        pronosticsEmployee = historyTable.reduce(
          (result: any, currentValue: any) => {
            (result[currentValue["employee"]] =
              result[currentValue["employee"]] || []).push(currentValue);
            return result;
          },
          {}
        );

        let counterTwo = 0;
        const promiseTwo = new Promise<void>((resolve) => {
          Object.keys(pronosticsEmployee).forEach((key) => {
            let report = pronosticsEmployee[key]
              .map(
                (pronostic: {
                  status: any;
                  matchs: any[];
                  equipe1: any;
                  equipe2: any;
                  options: any;
                  createdAt: any;
                }) => {
                  return `<tr>
        <td><i>${pronostic.status}</i></td>
        <td>${pronostic.matchs[0]} <strong> ${
                    pronostic.equipe1
                  } </strong> - <strong> ${pronostic.equipe2} </strong>${
                    pronostic.matchs[1]
                  }</td>
        <td> ${pronostic.options}</td>
        <td>${pronostic.createdAt.getHours()}:${pronostic.createdAt.getMinutes()} </td>            
        </tr>`;
                }
              )
              .join("");
            mail(
              key,
              "Rapport quotidien sur wind Pronostics! ",
              DailyReport(report, date)
            );
          });
          counterTwo++;
          if (Object.keys(pronosticsEmployee).length === counterTwo) resolve();
        });
        promiseTwo.then(() => {
          console.log("success");
        });
        promiseTwo.catch((error) => {
          console.log("error", error);
        });
      });
      promise.catch((error) => {
        console.log("error", error);
      });
    } catch (err) {
      console.log("error", err);
    }
  });
  scheduledJobFunction.start();
};

export const initScheduledJobsError = () => {
  const scheduledJobFunction = CronJob.schedule("0 0 0 * * *", async () => {
    console.log("I'm executed on a schedule!");
    let date = moment(eleminateHours(new Date(), 24, 0)).format("YYYY-MM-DD");
    let message: string[] = [];
    let employeesIds: number[];
    let matchsIds: number[];
    let historyTable: any[] = [];

    try {
      const groupesEvent = await Groupes.findAll({
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });

      const grIds = groupesEvent.map((gr) => gr.id);
      const matches = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            attributes: ["name"],
          },
        ],
      });

      const employeesEmails = await User.findAll({
        where: {
          role: "employee",
          is_active: true,
          company_id: 10,
        },
        attributes: ["id", "email"],
      });

      await sequelize
        .query(
          "SELECT id FROM `user` where `company_id` = 10 AND `role`= 'employee'"
        )
        .then((employees) => {
          employeesIds = employees[0].map((employee: { id: number }) => {
            return employee.id;
          });
        })
        .catch((err) => console.log(err, "err"));

      await sequelize
        .query("SELECT id from matchs where  CAST(date AS DATE) =$date", {
          bind: {
            date,
          },
        })
        .then((matchs) => {
          matchsIds = matchs[0].map((match: { id: number }) => {
            return match.id;
          });
        })
        .catch((err) => console.log(err, "err"));
      let counter = 0;
      const t = await sequelize.transaction();
      const promise = new Promise<void>((resolve) => {
        employeesIds.forEach((employeeId: number) => {
          matchsIds.forEach((matchId: number) => {
            sequelize
              .query(
                "SELECT equipe1 as hTeam1, equipe2 as hTeam2, match_id as hMatchId, employee_id as hEmployeeId FROM `pronostics_history` where `match_id` = $matchId  and `employee_id`= $employeeId GROUP by createdAt DESC LIMIT 1 ",
                {
                  bind: {
                    employeeId,
                    matchId,
                  },
                  transaction: t,
                }
              )
              .then((pronosticHistory) => {
                historyTable = historyTable.concat(pronosticHistory[0]);
                counter++;
                if (matchsIds.length * employeesIds.length === counter)
                  resolve();
              })
              .catch((error) => {
                console.log("error1", error);
              });
          });
        });
        if (matchsIds.length * employeesIds.length === counter) resolve();
        counter++;
      });
      promise
        .then(() => {
          t.commit();

          sequelize
            .query(
              "SELECT p.equipe1 as team1, p.equipe2 as team2, p.match_id as matchId, p.employee_id as employeeId FROM `pronostics` AS p JOIN `user` as u ON u.id = p.employee_id JOIN `matchs` as m ON m.id = p.match_id WHERE u.is_active = 1 AND u.company_id = 10 AND role= 'employee' AND CAST(m.date AS DATE) = $date",
              {
                bind: {
                  date,
                },
              }
            )
            .then((pronostics) => {
              let allPronostics: any[] = pronostics[0];
              historyTable.map((history, index) => {
                matches.map((match) => {
                  if (history.hMatchId === match.id)
                    historyTable[index].hMatch = match.equipes.map(
                      (equipe) => equipe.name
                    );
                });

                employeesEmails.map((employee) => {
                  if (history.hEmployeeId === employee.id)
                    historyTable[index].hEmployee = employee.email;
                });
              });

              allPronostics.map((pronostic: any, index) => {
                matches.map((match) => {
                  if (pronostic.matchId === match.id)
                    allPronostics[index].match = match.equipes.map(
                      (equipe) => equipe.name
                    );
                });

                employeesEmails.map((employee) => {
                  if (pronostic.employeeId === employee.id)
                    allPronostics[index].employee = employee.email;
                });
              });

              historyTable.map((history: any) => {
                allPronostics.map((pronostic: any) => {
                  if (
                    history.hMatchId === pronostic.matchId &&
                    history.hEmployeeId === pronostic.employeeId &&
                    (history.hTeam1 !== pronostic.team1 ||
                      history.hTeam2 !== pronostic.team2)
                  )
                    message.push(
                      "Un erreur produit avec l'employee : " +
                        pronostic.employee +
                        " dans Match " +
                        history.hMatch[0] +
                        " - " +
                        history.hMatch[1] +
                        " dernière résultat dans l'historique " +
                        history.hTeam1 +
                        " - " +
                        history.hTeam2 +
                        " mais le résultat affiché " +
                        pronostic.team1 +
                        " - " +
                        pronostic.team2 +
                        "<br/>"
                    );
                });
              });
              mail(
                "nourtst1@gmail.com",
                "Un erreur produit sur wind Pronostics! ",
                WarningInPronostics(message)
              );
            })
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          console.log("error3", error);
        });
    } catch (err) {
      console.log(err);
    }
  });
  scheduledJobFunction.start();
};

export default initScheduledJobs;
