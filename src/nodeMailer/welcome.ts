export const welcomePartner = async (data: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wind mail</title>
  </head>
  <body style="background-color: #506791;">
    <table border="0" width="100%" cellpading="0" cellspacing="0">
      <tr>
        <td rowspan="8" width="15%">&nbsp;</td>
        <td width="70%">&nbsp;</td>
        <td rowspan="8" width="15%">&nbsp;</td>
      </tr>
      <tr>
        <td style=" text-align: center;
        
       ">
          <table width="100%" cellpading="0" cellspacing="0" border="0">
            <tr>
                <td style="background-color: #506791; border: 0px solid #506791;">
                    <img src="http://51.89.192.238:81/wind.png" alt="logo"  style="padding: 10px; height: 60px; text-align: center;" />
                      </td>
            </tr>
            
          </table>
        </td>
      </tr>
      <tr>
        <td
          style="
            text-align: center;
          "
        >
          <img src="http://51.89.192.238:81/img-carousel-2.jpg" alt="logo" style=" width: 100%;" />
        </td>
      </tr>
      <tr>
        <td  style="background-color: #cccccc59; text-align: center; font-size: 18px;padding: 10px; color: white;">
            <div style="font-size: 24px; font-weight: bold; text-align: start; padding: 10px;"> Bonjour <span style="font-weight: 100 ; font-size: 20px;">${data}</span></div>
            Votre inscription à <b>Pronostic</b> a bien été prise en compte. 
            Vous allez recevoir un email d'activation pour accéder a notre Plateforme. 
        Merci pour votre visite.
        <div style="text-align: end; color: rgb(74, 70, 70); font-size: 10px;">Pronostic Team.</div>
        </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html> 
        `;
};

export const activationPartner = async (data: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wind mail</title>
    </head>
    <body style="background-color: #506791;">
      <table border="0" width="100%" cellpading="0" cellspacing="0">
        <tr>
          <td rowspan="8" width="15%">&nbsp;</td>
          <td width="70%">&nbsp;</td>
          <td rowspan="8" width="15%">&nbsp;</td>
        </tr>
        <tr>
          <td style=" text-align: center;">
            <table width="100%" cellpading="0" cellspacing="0" border="0">
              <tr>
                  <td style="background-color: #506791; border: 0px solid #506791;">
                      <img src="http://51.89.192.238:81/wind.png" alt="logo" style="padding: 10px; height: 60px; text-align: center;">
                    <div></div>
                        </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; ">
            <img src="http://51.89.192.238:81/img-carousel-2.jpg" alt="logo" style=" width: 100%;" />
          </td></tr>
           <tr>
          <td  style="background-color: #cccccc59; text-align: center; font-size: 18px;padding: 10px; color: white;">
              <div style="font-size: 24px; font-weight: bold; text-align: start; padding: 10px;"> Bonjour </div>
              Votre compte chez <b>Pronostic</b> a bien été activé. <br/>
          Merci pour votre visite.
          <div style="text-align: end; color: rgb(74, 70, 70); font-size: 10px;">Pronostic Team.</div>
          </td>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
  
       
      </table>
    </body>
  </html>



  
          `;
};

export const welcomeEmployee = (email: string, pwd: string) => {
  return `
        <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wind mail</title>
    </head>
    <body style="background-color: #506791;">
      <table border="0" width="100%" cellpading="0" cellspacing="0">
        <tr>
          <td rowspan="8" width="15%">&nbsp;</td>
          <td width="70%">&nbsp;</td>
          <td rowspan="8" width="15%">&nbsp;</td>
        </tr>
        <tr>
          <td style=" text-align: center;
          
         ">
            <table width="100%" cellpading="0" cellspacing="0" border="0">
              <tr>
                  <td style="background-color: #506791; border: 0px solid #506791;">
                      <img src="http://51.89.192.238:81/wind.png" alt="logo" style="padding: 10px; height: 60px; text-align: center;">
                    <div></div>
                        </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
           <img src="http://51.89.192.238:81/img-carousel-2.jpg" alt="logo" style=" width: 100%;" />
          </td>
         </tr>
        <tr>
          <td  style="background-color: #cccccc59; text-align: center; font-size: 18px;padding: 10px; color: white;">
              <div style="font-size: 24px; font-weight: bold; text-align: start; padding: 10px;"> Bonjour </div>
              <h2> email : ${email}</h2>
              <h2> password : ${pwd}</h2>
              <button style="background-color: #4183c4; padding: 10px; border-radius: 8px;"><a href='http://windpronostics.com' style="color: white; text-decoration: none;">Login</a></button>
          <div style="text-align: end; color: rgb(74, 70, 70); font-size: 10px;">Pronostic Team.</div>
          </td>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
          `;
};

export const changementPassword = async (data: string) => {
  return `
     

        <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wind mail</title>
    </head>
    <body style="background-color: #506791;">
      <table border="0" width="100%" cellpading="0" cellspacing="0">
        <tr>
          <td rowspan="8" width="15%">&nbsp;</td>
          <td width="70%">&nbsp;</td>
          <td rowspan="8" width="15%">&nbsp;</td>
        </tr>
        <tr>
          <td style=" text-align: center;
          
         ">
            <table width="100%" cellpading="0" cellspacing="0" border="0">
              <tr>
                  <td style="background-color: #506791; border: 0px solid #506791;">
                      <img src="http://51.89.192.238:81/wind.png" alt="logo" style="padding: 10px; height: 60px; text-align: center;">
                    <div></div>
                        </td>
                
               
              </tr>
  
              
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <img src="http://51.89.192.238:81/img-carousel-2.jpg" alt="logo" style=" width: 100%;" />
          </td>
        </tr>
        <tr>
          <td  style="background-color: #cccccc59; text-align: center; font-size: 18px;padding: 10px; color: white;">
              <div style="font-size: 24px; font-weight: bold; text-align: start; padding: 10px;"> Bonjour </div>
              Votre code de changement de votre password est: <br/>
                        ${data}<br/>
                    Merci pour votre visite.<br/>
          <div style="text-align: end; color: rgb(74, 70, 70); font-size: 10px;">Pronostic Team.</div>
          </td>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`;
};
export const deactivatePartner = async (data: string) => {
  return `
        <div>
            <h3> Bonjour </h3>
                Votre compte chez <b>Pronostic</b> a bien été désactivé. <br/>
                
            Merci pour votre visite.<br/>
            Pronostic Team.

        </div>
        `;
};

export const DailyReport = (test: any[], date: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wind mail</title>
        <style>
          .center {
            margin: auto;
            width: 80%;
            border: 1px solid #CDCDCD;
            padding: 20px;
          }
          saturate { color: blue; }
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;          
          }    
          th, td {
            padding-top:8px;
            padding-bottom:8px;
            text-align: center;
          }      
        </style>
    </head>
    <body class="center">
   <h3> Merci d'avoir visité Wind Pronostics : </h3>
    <strong> <h4>Vos actions le <i> ${date} :</i></h4></strong>
    <br/>
      <table style="width:90%">
          <tr>
            <th>Statut</th>
            <th>Match</th>
            <th>Options</th>
            <th>Heure</th>
          </tr>
          ${test}
      </table>
    <br/><br/><br/>
    <div>
    Team Wind Pronostics.
    </div>
    <img src="http://51.89.192.238:81/wind.png"  class="saturate" alt="logo" style="padding: 10px; height: 60px; text-align: center;">
    </body>
</html>`;
};

export const WarningInPronostics = (message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wind mail</title>
        <style>
          .center {
            margin: auto;
            width: 80%;
            border: 1px solid #CDCDCD;
            padding: 20px;
          }
          saturate { color: blue; }
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;          
          }    
          th, td {
            padding-top:8px;
            padding-bottom:8px;
            text-align: center;
          }      
        </style>
    </head>
    <body class="center">

       ${message}

    </body>
</html>`;
};
