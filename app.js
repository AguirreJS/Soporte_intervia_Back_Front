




//MODULOS REQUERIDOS

const random = require('string-random')
const session = require('express-session')
const express = require('express');
const path = require('path');
const app = express();
const mysql= require('mysql2');
const nodemailer = require('nodemailer');
const {send } = require('process');
const { connect } = require('http2');
const { Console } = require('console');
const { read } = require('fs');
const fs = require('fs');
const multer = require('multer');
const buffer = require('buffer');
const bodyParser = require('body-parser');
const OAuth2 = require('oauth2').OAuth2;
app.set('trust proxy', true);
const axios = require('axios');
const XLSX = require('xlsx'); 
const cron = require('node-cron');
require('dotenv').config({path: './.env'});






////// AUMENTAR EL LIMITE DE LOS ARCHIVOS JSON QUE LLEGAN AL SERVIDOR

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));



////////// MULTER PARA MANEJAR IMAGENES 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.imgtk + path.extname(file.originalname))
  },
  limits: {
    fileSize: 15 * 1024 * 1024 // 15mb
  }
});

//////BACKUP DE LA BASE DE DATOS CADA 24HS







////////////////// Metodo antiguo

 /*const correosalida = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
      user: 'astronomia1997@gmail.com',
      pass: 'rqtqumwixttddcm'
  }
});  */


/////////////////// Notificaciones por defecto. 

let Notificacionespordefecto = "0000000000000"; 



////////////// CONEXION CON EL CORRE DE MICROSOFT A TRAVES DE UN TOKEN!!!


const MAX_RETRIES = 3;
const BACKOFF_DELAY = 5000; // 5 segundos, de espera para el proximo correo




async function sendEmail(AsuntoCoreo, ContenidoCorre,CorreoObjetivo ) {

  let tenantID = process.env.TENANT // Get from Azure App Registration
let oAuthClientID =process.env.OAUTH // Get from Azure App Registration
let clientSecret = process.env.SECRET // Get from Azure App Registration
let oAuthToken; // declared, gets defined if successfully fetched

let userFrom = process.env.CORREOPRI
let msgPayload = {
  message: {
      subject: AsuntoCoreo,
      body: {
          contentType: 'HTML',
          content: ContenidoCorre,
      },
      toRecipients: [{ emailAddress: { address: CorreoObjetivo } }]
  }
};

try {
  let response = await axios({
      method: 'post',
      url: `https://login.microsoftonline.com/${tenantID}/oauth2/token`,
      data: new URLSearchParams({
          client_id: oAuthClientID,
          client_secret: clientSecret,
          resource: "https://graph.microsoft.com",
          grant_type: "client_credentials"
      }).toString()
  });
  oAuthToken = response.data.access_token;
} catch (error) {
  console.error("Error obteniendo el token:", error);
  throw new Error("Error al obtener el token de autenticación.");
}

for (let i = 0; i < MAX_RETRIES; i++) {
  try {
      await axios({
          method: 'post',
          url: `https://graph.microsoft.com/v1.0/users/${userFrom}/sendMail`,
          headers: {
              'Authorization': "Bearer " + oAuthToken,
              'Content-Type': 'application/json'
          },
          data: msgPayload
      });
      return; // Si el correo se envía con éxito, sal del bucle
  } catch (error) {
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.code === 'ApplicationThrottled') {
          console.warn("Aplicación sobre el límite de concurrencia, reintentando...");
          await new Promise(resolve => setTimeout(resolve, BACKOFF_DELAY)); // Espera un poco antes de reintentar
      } else {
          console.error("Error enviando el correo:", error);
          throw new Error("Error al enviar el correo.");
      }
  }
}
throw new Error("Máximo número de intentos alcanzado al enviar el correo.");
}

////////////////////////////////// Correo con copia





async function sendEmailCopia(AsuntoCoreo, ContenidoCorre,CorreoObjetivo, arraysdecorreos ) {

  let tenantID = process.env.TENANT // Get from Azure App Registration
let oAuthClientID =process.env.OAUTH // Get from Azure App Registration
let clientSecret = process.env.SECRET // Get from Azure App Registration
let oAuthToken; // declared, gets defined if successfully fetched

let userFrom = process.env.CORREOPRI
let msgPayload = { 
  //Ref: https://learn.microsoft.com/en-us/graph/api/resources/message#properties
  message: {
    subject: AsuntoCoreo,
    body: {
      contentType: 'HTML',
      content: ContenidoCorre,
    },
    toRecipients: [{ emailAddress: { address: CorreoObjetivo } }],
    ccRecipients: arraysdecorreos.map((correo) => {
      return { emailAddress: { address: correo } };
    }), // Agrega las direcciones de correo en copia desde el array
  }
};

//using axios as http helper
await axios({ // Get OAuth token to connect as OAuth client
  method: 'post',
  url: `https://login.microsoftonline.com/${tenantID}/oauth2/token`,
  data: new URLSearchParams({
    client_id: oAuthClientID,
    client_secret: clientSecret,
    resource: "https://graph.microsoft.com",
    grant_type: "client_credentials"
  }).toString()
})
.then(r => oAuthToken = r.data.access_token)

await axios ({ // Send Email using Microsoft Graph
  method: 'post',
  url: `https://graph.microsoft.com/v1.0/users/${userFrom}/sendMail`,
  headers: {
    'Authorization': "Bearer " + oAuthToken,
    'Content-Type': 'application/json'
  },
  data: msgPayload
})}


// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});




/////////////////////////////

//CONEXION A LA BASE DE DATOS    

const conector = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password : process.env.PSMSQL ,
  database: 'intervia',  })
  
  
  const conectar = ()=> {
  conector.connect(err => {
  if(err) {throw err; console.log('error en bs')} else { 
  console.log('Conectado')}
  
  })
}



//PUERTO DE CONEXION AL SERVIDOR

app.listen('4000', function(){
    console.log("Servidor Iniciado")
})

//CARPETA PUBLICA

app.use( express.static('public'));

// CONFIGURACION DE COOKIS

app.use(session({
    secret:process.env.PSCOOKIS,
    resave: true,
    saveUninitialized:true,

}))





/////////  Poner el marcha los Emails. 

let EmailMarcha = [1,0]

// 0 == Cuando el administrador te rgistra se te envia una notificaicon. 
// 1 == Ticket creados por un administrador notificando al usuario






//RUTAS Y SOLICITUDES DE TIPÓ PUBLICAS

app.get('/', function(req,res){

  res.sendFile(path.resolve(__dirname, "public" , "index.html"));
  console.log("solicitud recivida")




});



///////////////////////////// Crear numero random no utilizado. 
let valorFinal;
function obtenerNumeroUnico() {

function buscarValor(valor, callback) {
let valor1 = "T" + valor; 
const sql = `SELECT * FROM tikets WHERE ntiket = '${valor1}'`;
conector.query(sql, function(err, result, fields) {
  if (err) throw err;
  if (result.length > 0) {
  console.log("El valor ya existe en la base de datos, sumar 1 y buscar de nuevo")
    const nuevoValor = valor + 1;
    sendEmail("Un Numero de ticket fue repetido", valor , "soporte2@rhglobal.com.ar" )
    buscarValor(nuevoValor, callback);
  } else {
    valorFinal = valor;
    console.log( "Proximo Ticket es =" + valorFinal)
    callback(valorFinal);
  }
});
}

// Generar un número aleatorio inicialhttps://
const numeroAleatorio = random(6, {letters: false});

// Buscar un valor único en la base de datos
buscarValor(numeroAleatorio, function(valor1) {
// La función de retorno de llamada se llama cuando se encuentra un valor único
valorFinal = valor1;
});

// Retornar el valor final una vez que se ha encontrado
return valorFinal;
}

obtenerNumeroUnico()







//REGISTRO DE UN NUEVO USUARIO

app.post('/logeo', async(req, res)=>{

console.log(req.body.empresa)
var nombre = req.body.nombre;
var apellido = req.body.apellido;
var correo = req.body.correo;
var pass = req.body.pass;
var nacimiento = req.body.nacimiento;
var anydesk = req.body.anydesk;
var telefono = req.body.telefono;
var codigov = random(16);
var valid2 = req.body.valid2;
var valid3 = req.body.valid3;
var valid4 = req.body.valid4;
var valid5 = Notificacionespordefecto;
console.log("termino 1")
//Validar si el usuario existe 
const sql=`SELECT * FROM intervia WHERE correo = '${correo}'`
 conector.query(sql, function(err,result,filed) {
 if (err) throw err
 console.log(result[0]);
if ( result[0] == undefined){ 

/// Validar si existe alguna empresa con ese dominio asiganado.


const sql7=`SELECT * FROM empresa WHERE dominio = '${req.body.empresa}'`
 conector.query(sql7, function(err,result22,filed) {
 if (err) throw err
 console.log(result22); 

 function retornar (){
  sin= "Sin empresa";
  if (result22[0] == undefined) { return sin  }
  else { return result22[0].empresa }
 }




const sql2=`INSERT INTO intervia (id, nombre, apellido, correo , pass , empresa , nacimiento , anydesk , telefono , codigov , valid2 , valid3 , valid4 , valid5 ) VALUES (${null}, '${nombre}','${apellido}', '${correo}' , '${pass}' , '${retornar ()}' , '${nacimiento}', '${anydesk}', '${telefono}','${codigov}', '${valid2}', '${valid3}' , '${valid4}' , '${valid5}')`
conector.query(sql2, function(err,result,filed) {
  if(err) throw err
  console.log(result)
})
//
req.session.nombre= nombre;
req.session.correo= correo;
req.session.codigov= codigov;
req.session.online= false;
req.session.register=true;
req.session.save(function(err) {
})

console.log(req.session.body)


//Envio de Mail

//CorreoHTML
 let subject = 'Registro Sistema Intervia No-Replay';
 let text= `

 <html>
   <head>
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
   <meta charset="utf-8">
   <style>
     *{
       font-family: 'Poppins', sans-serif;
     }
     body {
       background: rgb(44, 44, 45);
     }
     .Bloque1 {
       width: 50%;
       margin-left: 25%;
       background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
       background-size: cover;
       margin-top: 5%;
       border-radius: 5px;
     }
     
     .Bienvenido {
       width: 100%;
       text-align: center;
       color: rgb(127, 87, 157);
     }
     .Registrarme {
       width: 50%;
       margin-left: 25%;
       text-align: center;
       display: block;
       text-decoration: none;
       color: black;
       border-bottom: solid 4px #8fdff3 ;
       border-bottom-width: 10%;
       font-size: 15px;
       text-decoration: none;
     }
     .info {
       color: #000000;
       padding-left: 20%;
       padding-right: 20%;
       margin-top: 10%;
       padding-bottom: 10%;
     }



   </style>
   </head>
   <body>
     
     <div class="Bloque1">
       <h1 class="Bienvenido">Bienvenido</h1>
       <a class="Registrarme" href="https://www.soporte.intervia.com.ar/UserValid/${codigov}"> Click Aqui Para finalizar registro. </a>

       <p class="info">A principios del año 2023 Intervia junto con Rh global comenzará a implementar un sistema de tickets para organizar mejor sus soportes.

         Este innovador sistema permite un control más personal sobre sus solicitudes o soportes, ya sea que estos tengan una duración más prolongada que una simple atención.
         
         Además, permite llevar una bitácora sobre los problemas más comunes de su equipo y ver si estos se repiten en'el tiempo para tomar otras decisiones.</p>

     </div>
   
   </body>
 </html>
  





`  

 sendEmail(subject, text, correo )


res.send(true)
      }) }  
     else
          { console.log("el usuario ya esta registrado"); req.session.register=false; res.send(false) 
        
         
        //CorreoHTML  
    let correosalida = correo;

    let codigov = result[0].codigov;

    let Asunto = `Reestablecer Contraseña - Sistema Intervia` ;

    let Cuerpo = ` <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
      *{
        font-family: 'Poppins', sans-serif;
      }
      body {
        background: rgb(44, 44, 45);
      }
      .Bloque1 {
        width: 50%;
        margin-left: 25%;
        background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
        background-size: cover;
        margin-top: 5%;
        border-radius: 5px;
      }
      
      .Bienvenido {
        width: 100%;
        text-align: center;
        color: rgb(127, 87, 157);
      }
      .Registrarme {
        width: 50%;
        margin-left: 25%;
        text-align: center;
        display: block;
        text-decoration: none;
        color: black;
        border-bottom: solid 4px #8fdff3 ;
        border-bottom-width: 10%;
        font-size: 15px;
        text-decoration: none;
      }
      .info {
        color: #000000;
        padding-left: 20%;
        padding-right: 20%;
        margin-top: 10%;
        padding-bottom: 10%;
      }



    </style>
    </head>
    <body>
      
      <div class="Bloque1">
        <h1 class="Bienvenido">Reestablecer Contraseña </h1>
        <a class="Registrarme" href="https://www.soporte.intervia.com.ar/newuseradmin/${codigov}"> Click Aqui Para establecer contraseña. </a>

        <p class="info">Parece que ya estás registrado en el sitio web de Soportes de Intervia. A través de este enlace, puedes restablecer tu contraseña o solicitar a un administrador que la cambie por ti. Recuerda que no es necesario iniciar sesión para abrir un ticket. Puedes solicitar tu código QR o enlace personalizado para abrir un ticket sin necesidad de iniciar sesión.  </p>
        <p class="info">A principios del año 2023 Intervia junto con Rh global comenzará a implementar un sistema de tickets para organizar mejor sus soportes.

          Este innovador sistema permite un control más personal sobre sus solicitudes o soportes, ya sea que estos tengan una duración más prolongada que una simple atención.
          
          Además, permite llevar una bitácora sobre los problemas más comunes de su equipo y ver si estos se repiten en'el tiempo para tomar otras decisiones.</p>

      </div>
    
    </body>
  </html>
   



`

    sendEmail(Asunto, Cuerpo, correosalida )
        
        
        
        ///
                }  });

})

/// INGRESO DE USUARIO DE MANERA MANUAL 

app.post('/logeoman', async(req, res)=>{

let UserExistente = [];


console.log(req.body.empresa)

var nombre = req.body.nombre;
var apellido = req.body.apellido;
var correo = req.body.correo;
var pass = req.body.pass;
var nacimiento = req.body.nacimiento;
var anydesk = req.body.anydesk;
var telefono = req.body.telefono;
var codigov = random(16);
var valid2 = req.body.valid2;
var valid3 = req.body.valid3;
var valid4 = req.body.valid4;
var valid5 = Notificacionespordefecto;
console.log("termino 1")
//Validar si el usuario existe 
const sql=`SELECT * FROM intervia WHERE correo = '${correo}'`
  conector.query(sql, function(err,result,filed) {
  if (err) throw err
  UserExistente = result[0];

if ( result[0] == undefined){ 


 /// Validar si existe alguna empresa con ese dominio asiganado.

 
 const sql7=`SELECT * FROM empresa WHERE dominio = '${req.body.empresa}'`
  conector.query(sql7, function(err,result22,filed) {
  if (err) throw err
  console.log(result22); 
 
  function retornar (){
   sin= "Sin empresa";
   if (result22[0] == undefined) { return sin  }
   else { return result22[0].empresa }
  }




 const sql2=`INSERT INTO intervia (id, nombre, apellido, correo , pass , empresa , nacimiento , anydesk , telefono , codigov , valid2 , valid3 , valid4 , valid5 ) VALUES (${null}, '${nombre}','${apellido}', '${correo}' , '${pass}' , '${retornar ()}' , '${nacimiento}', '${anydesk}', '${telefono}','${codigov}', '${valid2}', '${valid3}' , '${valid4}' , '${valid5}')`
conector.query(sql2, function(err,result,filed) {
   if(err) throw err
   console.log(result)
})
//
res.send(true)



   if ( EmailMarcha[0] == 1) {

   let text =  `<html>
   <head>
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
   <meta charset="utf-8">
   <style>
     *{
       font-family: 'Poppins', sans-serif;
     }
     body {
       background: rgb(44, 44, 45);
     }
     .Bloque1 {
       width: 50%;
       margin-left: 25%;
       background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
       background-size: cover;
       margin-top: 5%;
       border-radius: 5px;
     }
     
     .Bienvenido {
       width: 100%;
       text-align: center;
       color: rgb(127, 87, 157);
     }
     .Registrarme {
    margin-top: 16%;
    width: 90%;
    margin-left: 0%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: white; /* Cambiado a texto blanco para resaltar */
    background-color: #8fdff3; /* Fondo con color de resaltado */
    border: none; /* Eliminado el borde inferior */
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2); /* Agregada sombra */
    font-size: 18px;
    padding: 10px 20px; /* Espaciado interno para resaltar el botón */
    cursor: pointer; /* Cambiado el cursor al tipo de mano para indicar clicabilidad */
}

     .info {
       color: #000000;
       padding-left: 20%;
       padding-right: 20%;
       margin-top: 10%;
       padding-bottom: 10%;
     }

     .pieDePagina {
    background: linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);
    width: 50%;
    height: 20%;
    border-radius: 4px;
    margin-left: 25%;
    margin-top: 0;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}

.info2 {
    font-size: 9px;
    color: #000;
    width: 80%;
    margin-bottom: 0px;
    padding: 0px;
    text-align: center;
    margin-left: 10%;
}
 
 
 
   </style>
   </head>
   <body>
     
     <div class="Bloque1">
       <h1 class="Bienvenido">Hola ${nombre}</h1>
 
       <p class="info"> 

        Has sido registrado en Intervia Tickets por un administrador. Esto puede deberse a que se va a crear un nuevo ticket en tu nombre o porque el administrador ha resuelto un problema que experimentabas y desea actualizar esta información en nuestra base de datos. Aunque este sistema funciona de manera automática y no requiere tu atención, si necesitas solicitar nuevos soportes, puedes hacerlo utilizando el siguiente enlace para establecer una contraseña y comenzar a utilizarlo. También tienes la opción de solicitar tu propio código QR personalizado, que te permitirá generar un ticket sin necesidad de iniciar sesión. Agradecemos tu atención y confianza en nuestro servicio. 
       <a class="Registrarme" href="https://www.soporte.intervia.com.ar/newuseradmin/${codigov}"> Click Aqui para establecer una contraseña. </a>
 
       <h1 class="Bienvenido">Mas info</h1>
 
       <p class="info">A principios del año 2023, Intervia y Rh Global han iniciado la implementación de un sistema de tickets con el objetivo de mejorar la organización de sus solicitudes y soportes.

        Este sistema innovador ofrece la posibilidad de tener un control más personalizado sobre las solicitudes y soportes, incluso cuando requieren una atención prolongada. Además, facilita el seguimiento de un registro de los problemas más frecuentes en el equipo, lo que permite identificar patrones a lo largo del tiempo y tomar decisiones informadas en consecuencia.</p>
 
      <p class="info2" >  Tus datos están seguros con nosotros. No compartimos tu información personal fuera de nuestra operación y no la compartiremos con terceros. Tu privacidad es nuestra prioridad. No enviamos correos no deseados y nunca te pediremos contraseñas por ningún medio. Puedes confiar en nuestra dedicación a mantener tus datos seguros y proteger tu privacidad.
    </p>

     </div>


     <div class="pieDePagina">  
        <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
      
      </div>
   
   </body>
 </html>
 
 
 `
 

 sendEmail("Fuiste registrado en Intervia Soportes" , text , correo ); }








       }) } else { 


        let codigoDelUsuarioYaExistente = UserExistente.codigov;



        
let text = `<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
*{
  font-family: 'Poppins', sans-serif;
}
body {
  background: rgb(44, 44, 45);
}
.Bloque1 {
  width: 50%;
  margin-left: 25%;
  background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
  background-size: cover;
  margin-top: 5%;
  border-radius: 5px;
}

.Bienvenido {
  width: 100%;
  text-align: center;
  color: rgb(127, 87, 157);
}
.Registrarme {
  width: 50%;
  margin-left: 25%;
  text-align: center;
  display: block;
  text-decoration: none;
  color: black;
  border-bottom: solid 4px #8fdff3 ;
  border-bottom-width: 10%;
  font-size: 15px;
  text-decoration: none;
}
.info {
  color: #000000;
  padding-left: 20%;
  padding-right: 20%;
  margin-top: 10%;
  padding-bottom: 10%;
}



</style>
</head>
<body>

<div class="Bloque1">
  <h1 class="Bienvenido"> Hola ${UserExistente.nombre}</h1>

  <p class="info"> Un administrador de Intervia  ha solicitado que restablezcas tu contraseña. Esto puede deberse a que el administrador está a punto de generar un nuevo ticket en tu nombre o ha resuelto algún problema y desea actualizar la información en nuestra base de datos. Si crees que has recibido este correo por error, por favor ignóralo. Si no es así, haz clic en el enlace que se encuentra más abajo para revisar el historial de avances y soluciones de tus últimos soportes. </p>



  <a class="Registrarme" href="https://www.soporte.intervia.com.ar/UserValid/${codigoDelUsuarioYaExistente}"> Click Aqui establecer una nueva contraseña. </a>

  <h1 class="Bienvenido">Mas info sobre Intervia</h1>

  <p class="info">A principios del año 2023 Intervia junto con Rh global comenzará a implementar un sistema de tickets para organizar mejor sus soportes.

    Este innovador sistema permite un control más personal sobre sus solicitudes o soportes, ya sea que estos tengan una duración más prolongada que una simple atención.
    
    Además, permite llevar una bitácora sobre los problemas más comunes de su equipo y ver si estos se repiten en'el tiempo para tomar otras decisiones.</p>

</div>

</body>
</html>`;


res.send(false)


         //CorreoHTML

if (EmailMarcha[0] == 1){sendEmail("Informacion Sistema Intervia" , text, correo );}
      
      
      
      }   });


     
    
          
        
        
          })


// RESPUESTA DEL SERVIDOR PARA VALIDAR EL CORREO (actualmente obsoleto pero no descontinuado)

app.post('/codigosession', async function(req,res){

const codigov = req.body.codigov;
console.log(req.body)
console.log("Solicitud validar codigo")
console.log(codigov)
const sql=`SELECT * FROM intervia WHERE codigov = '${codigov}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err
let resultado = result[0];
 if (resultado == undefined) { res.send(false) } 
 else if  (result[0].codigov == codigov) { 
    const sql2= `UPDATE intervia set valid2= "1" WHERE codigov='${result[0].codigov}'`
    conector.query(sql2, function(err,result,filed) {
        if (err) throw err
        console.log(result[0])});  res.send(true)  } 

})


});

// SESSION ONLINE
app.get('/indexvalidatorsessiontrue', function(req,res){ 

 
    req.session.online = true;
    req.session.save(function(err) {
   })
}); 

// VALIDAR SI LA SESSION ESTA ONLINE

app.get('/sessiononline', function(req,res){ 
res.send({
'empresa':req.session.empresa,
'nombre': req.session.nombre,
'correo': req.session.correo,
'codigov':req.session.codigov,
'apellido': req.session.apellido,
'online' : req.session.online})})



// INICIAR SESION 
app.post('/inisession', function(req, res){


console.log("Solicitudpara inicio de session")

var correo = req.body.correo; 
var passw = req.body.passw;
var IPusuario = req.body.ip;

console.log("El correo es" + correo)





const sql=`SELECT * FROM intervia WHERE correo = '${correo}'`
 conector.query(sql, function(err,result,filed) {
if (err) throw err
console.log(result[0])
if (result[0]== undefined){ 
  

  console.log("el usuario no existe");

  Baneosip(IPusuario,correo,"0");

req.session.online = false;
req.session.save(function(err) {  } )
  res.send(req.session.online);

  



        
      }
else if (result[0].correo == correo && result[0].pass == passw) { 
console.log("VALIDACION PROCESADA");
Baneosip(IPusuario,correo,"1");
console.log(result[0])
    req.session.nombre = result[0].nombre;
    req.session.apellido = result[0].apellido;
    req.session.online = true;
    req.session.valid2 = result[0].valid2;
    req.session.valid3 = result[0].valid3;
    req.session.valid4 = result[0].valid4;
    req.session.empresa = result[0].empresa;
    req.session.correo = result[0].correo;
    req.session.codigov = result[0].codigov;
    req.session.save(function(err) {  } )
      console.log(req.session.online)
      res.send(req.session.online); } else {  res.send(false); Baneosip(IPusuario,correo,"0");  } }) ; 


}
)

// CERRAR SESSION

app.get('/salir', function(req,res){ 
req.session.empresa = "";
req.session.valid2 = "";
req.session.nombre = "";
req.session.apellido = "";
req.session.correo = "";
req.session.valid3 = "";
req.session.online = undefined;
req.session.save(function(err) {
      } );

res.send( {'obj' : true} )

})




/// REESTABLECER LA CONTRASEÑA 

app.post('/pswregen', async function(req,res){ 

let codigov = req.body.codigov;
let npsw = req.body.npsw; 
console.log(npsw)
console.log(codigov)
console.log( req.session.resps)
if (npsw == undefined || req.session.resps == true ) {  res.send(false)  } else {
const sql= `UPDATE intervia set pass= '${npsw}' WHERE codigov='${codigov}'`
    conector.query(sql, function(err,result,filed) {
        if (err) throw err
        res.send(true);
        req.session.resps = true;
        req.session.save(function(err) {
        } );   }); }
         })


         app.post('/pswregen1', async function(req,res){ 
         
          let codigov = req.body.codigov;

          console.log(codigov)

          const sql=`SELECT * FROM intervia WHERE codigov = '${codigov}'`
          conector.query(sql, function(err,result,filed) {
         if (err) throw err
         console.log(result[0])
         if (result[0]== undefined){  res.send("false") } else { 

         




         let nacimietno = req.body.nacimiento;
          let codigov = req.body.codigov;
          let npsw = req.body.npsw; 
          console.log(req.body.nombre)
          console.log(req.body.apellido)
        
          
          const sql= `UPDATE intervia set pass= '${npsw}', nacimiento='${nacimietno}', nombre='${req.body.nombre}', apellido='${req.body.apellido}'  WHERE codigov='${codigov}'`
                conector.query(sql, function(err,result,filed) {
                    if (err) throw err
                    res.send(true);
                    req.session.resps = true;
                    req.session.save(function(err) {
                    } );   }); 
         }}) 
                     })





/// VALIDAR SI AL SELECCIONAR OLVIDE MI CONTRASEÑA EL USUARIO EXISTA REALMENTE


app.post('/olvilogin',  function(req,res){

let correo = req.body.correo;
const sql3=`SELECT * FROM intervia WHERE correo = '${correo}'`
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2[0]);
if ( result2[0] == undefined) { res.send(false)  } 
else { 

console.log("el usuario ya esta registrado"); req.session.register=false; res.send(true)         
console.log(result2[0].correo)




let correo1 = result2[0].correo;
let subject = ' Reestablecer Contraseña No-Replay';
let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
*{
  font-family: 'Poppins', sans-serif;
}
body {
  background: rgba(252, 252, 255, 0);

}
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}

.Bienvenido {
  width: 100%;
  text-align: center;
   font-size: 25px;
  color: rgb(127, 87, 157);
}
.Registrarme {
  width: 50%;
  margin-left: 25%;
  text-align: center;
  display: block;
  text-decoration: none;
  color: black;
  border-bottom: solid 4px #8fdff3 ;
  border-bottom-width: 10%;
  font-size: 15px;
  text-decoration: none;
}

.infoTitulo {
  color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
}

.info {
 color: #364242;
  margin-top: 10%;
  padding-bottom: 10%;
  text-align: center;
  font-size: 20px;
  width: 100%;
  display: inline-block;
  font-size: 25px;
}

.Bloque2 {
  background: rgba(163, 163, 163, 0.416);
  border-radius: 4px;
}

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>

<div class="Bloque1">

  <h1 class="Bienvenido">Reestablecer Contraseña</h1>
  <div class="Bloque2">

       <h1 class="infoTitulo"> Usted esta a punto de reestablecer la contraseña de su cuenta Intervia, porfavor has click en el enlace que se dejara mas abajo o contacte a los administradores del sitio para reestablecer su contraseña. </h1>
  

</div>

   <a class="info" href="https://www.soporte.intervia.com.ar/newuseradmin/${result2[0].codigov}">
   Reestablecer Contraseña Ahora </a>



<div class="pieDePagina"> 

<img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

</div>


</body>
</html>

`

sendEmail(subject, ContenidoCorre, correo1 );


}

}) })




//////////////// USUARIOS PARA NIVEL 2 


app.get('/lusuarion2',  function(req,res){ 



if(req.session.online == true && req.session.valid3 == 1) {

  res.sendFile(path.resolve(__dirname,"tikets" , "usuariosn2.html"));
  
  console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})

app.post('/historialpemp',  function(req,res){ 


console.log(req.session.empresa)
res.send(req.session.empresa)

})




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SISTEMA DE TIKETS //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/// INICIAR UN NUEVO TIKETS, SI EL USUARIO NO SE REGISTRO CORRECTAMENTE NO PUEDE INICIAR UN TIKET

app.get('/newtiket',  function(req,res){ 


if(req.session.online == true && req.session.valid2 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "backend-tikets.html"));
    
    console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})




//// INGRESAR EL TIKET  Y ALERTAR A LOS ADMINISTRADORES CUANDO SE ADJUNTA UNA IMAGEN


app.post('/sendtiketimg',  multer({ storage: storage }).single('file'), (req, res) => {

obtenerNumeroUnico()

var img = req.body.imagen;
var imgBuffer = Buffer.from(img, 'base64');
//crea un archivo temporal
var tempFile = './uploads/tempfile'
fs.writeFileSync(tempFile, imgBuffer);
var upload = multer({ dest: 'uploads/' }).single('file');
upload(req, res, function (err) {
fs.unlinkSync(tempFile);
});

let numa = valorFinal;
let num = "T" + numa;
let nomape =  `${req.body.nombre} ${req.body.apellido}`;
let imgtk = "IM" + num; 

const tiketfinal = req.body;
const imageData = tiketfinal.imagen;
const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
const buffer = Buffer.from(base64Data, 'base64');
fs.writeFileSync('uploads/'+imgtk+'.jpg', buffer);

let correo1 = req.body.correo

//// CARGA EN LA BASE DE DATOS 
const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura ) VALUES (${null}, '${num}','${req.body.empresa}', '${nomape}' , '${req.body.correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}','${imgtk}')`
conector.query(sql2, function(err,result,filed) {
   if(err) throw err
   console.log(result)
})

//////////ENVIO DE MAILS




const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
conector.query(sql1a1, function(err,result2,filed) {
console.log(result2.empresa)
console.log("")
let empresamail = result2[0].empresa;
let arr = result2[0].valid5.split("");

console.log(arr)

if (arr[0] == "1") {   


let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "Se les Informo a los Tecnicos que iniciaste un Ticket, Pronto se contactaran contigo." </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = " Generaste un Ticket Con el numero " + num;

sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )


//CodigoHLTM
console.log("Correcto tiene validado resivir notificaciones")

}


const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
conector.query(mailjefes, function(err,result8,filed) { 
 for(i=0; i< result8.length; i++ ){
   let buc = result8[i].valid5.split("");

   if (result8[i].valid3 == "1" && buc[1] == "1"  ) {

       


let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "En proceso." </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = " Nuevo Ticket Generado" + num;

sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )


//CodigoHLTM
console.log("Correo a" +  result8[i].correo)
    

   }


 }


} )


const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(admins, function(err,resultado,filed) { 
 for(i=0; i< resultado.length; i++ ){
   let buc = resultado[i].valid5.split("");

   if (resultado[i].valid4 == "1" && buc[3] == "1"  ) {

console.log("Correo para administradores enviado correctamente")

let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "En proceso." </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = " Nuevo Ticket Generado" + num;

sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )


//CodigoHLTM
console.log("Correo a" +  resultado[i].correo)
     
}


 }


} )





})


res.send(true)

})

app.post('/sendtiket',  function(req,res){ 

obtenerNumeroUnico()

let captura = "";
let numa = valorFinal;
let num = "T" + numa;
let nomape =  `${req.body.nombre} ${req.body.apellido}`;


//// CARGA EN LA BASE DE DATOS 
const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura ) VALUES (${null}, '${num}','${req.body.empresa}', '${nomape}' , '${req.body.correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}','${captura}')`
conector.query(sql2, function(err,result,filed) {
   if(err) throw err
   console.log(result)
})

 


let correo1 = req.body.correo

const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
conector.query(sql1a1, function(err,result2,filed) {
console.log(result2.empresa)
console.log("")
let empresamail = result2[0].empresa;
let arr = result2[0].valid5.split("");

console.log(arr)

if (arr[0] == "1") {   


 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "Se les Informo a los Tecnicos que iniciaste un Ticket, Pronto se contactaran contigo." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

let AsuntoCoreo = " Generaste un Ticket Con el numero " + num;

sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )


//CodigoHLTM
console.log("Correcto tiene validado resivir notificaciones")

}


const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
conector.query(mailjefes, function(err,result8,filed) { 
  for(i=0; i< result8.length; i++ ){
    let buc = result8[i].valid5.split("");

    if (result8[i].valid3 == "1" && buc[1] == "1"  ) {

        


 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "En proceso." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

let AsuntoCoreo = " Nuevo Ticket Generado : " + num;

sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )


//CodigoHLTM
console.log("Correo a" +  result8[i].correo)
     

    }


  }


} )


const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(admins, function(err,resultado,filed) { 
  for(i=0; i< resultado.length; i++ ){
    let buc = resultado[i].valid5.split("");

    if (resultado[i].valid4 == "1" && buc[3] == "1"  ) {

console.log("Correo para administradores enviado correctamente")

 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "En proceso." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

let AsuntoCoreo = " Nuevo Ticket Generado :" + num;

sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )


//CodigoHLTM
console.log("Correo a" +  resultado[i].correo)
      
}


  }


} )





})


res.send(true)

})

/////////Ticket crearo a traves de un QR



app.post('/sendtiketimgQR',  multer({ storage: storage }).single('file'), (req, res) => {

const sql11=`SELECT * FROM intervia WHERE  codigov = '${req.body.Codigov}'`
conector.query(sql11, function(err,resulttadoCod,filed) {
console.log(resulttadoCod[0])

 


obtenerNumeroUnico()

var img = req.body.imagen;
var imgBuffer = Buffer.from(img, 'base64');
//crea un archivo temporal
var tempFile = './uploads/tempfile'
fs.writeFileSync(tempFile, imgBuffer);
var upload = multer({ dest: 'uploads/' }).single('file');
upload(req, res, function (err) {
  fs.unlinkSync(tempFile);
});

let numa = valorFinal;
let num = "T" + numa;
let nomape =  `${resulttadoCod[0].nombre} ${resulttadoCod[0].apellido}`;
let imgtk = "IM" + num; 

const tiketfinal = req.body;
const imageData = tiketfinal.imagen;
const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
const buffer = Buffer.from(base64Data, 'base64');
fs.writeFileSync('uploads/'+imgtk+'.jpg', buffer);

 //// CARGA EN LA BASE DE DATOS 
 const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura ) VALUES (${null}, '${num}','${resulttadoCod[0].empresa}', '${nomape}' , '${resulttadoCod[0].correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}','${imgtk}')`
 conector.query(sql2, function(err,result,filed) {
     if(err) throw err
     console.log(result)
 })
  
 


let correo1 =resulttadoCod[0].correo;

const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
conector.query(sql1a1, function(err,result2,filed) {
console.log(result2.empresa)
console.log("")
let empresamail = result2[0].empresa;
let arr = result2[0].valid5.split("");

console.log(arr)

if (arr[0] == "1") {   


 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente (QR o Link personal) </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "Se les Informo a los Tecnicos que iniciaste un Ticket, Pronto se contactaran contigo." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

let AsuntoCoreo = " Generaste un Ticket Con el numero " + num + "(QR o Link personal)" ;

sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )


//CodigoHLTM
console.log("Correcto tiene validado resivir notificaciones")

}


const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
conector.query(mailjefes, function(err,result8,filed) { 
  for(i=0; i< result8.length; i++ ){
    let buc = result8[i].valid5.split("");

    if (result8[i].valid3 == "1" && buc[1] == "1"  ) {

        


 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Se genero un nuevo Ticket : ${num}  </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "El ticket esta en proceso, se alertara a los tecnicos del problema." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

 let AsuntoCoreo = "Se genero un Ticket : " + num   ;

sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )


//CodigoHLTM
console.log("Correo a" +  result8[i].correo)
     

    }


  }


} )


const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(admins, function(err,resultado,filed) { 
  for(i=0; i< resultado.length; i++ ){
    let buc = resultado[i].valid5.split("");

    if (resultado[i].valid4 == "1" && buc[3] == "1"  ) {

console.log("Correo para administradores enviado correctamente")

 let ContenidoCorre = `
 <html>
 <head>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
 <meta charset="utf-8">
 <style>
   *{
     font-family: 'Poppins', sans-serif;
   }
   body {
     background: rgba(252, 252, 255, 0);
 
   }
.Bloque1 {
 border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
   
   .Bienvenido {
     width: 100%;
     text-align: center;
      font-size: 18px;
     color: rgb(127, 87, 157);
   }
   .Registrarme {
     width: 50%;
     margin-left: 25%;
     text-align: center;
     display: block;
     text-decoration: none;
     color: black;
     border-bottom: solid 4px #8fdff3 ;
     border-bottom-width: 10%;
     font-size: 15px;
     text-decoration: none;
   }

   .infoTitulo {
     color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
   }

   .info {
     color: #000000;
     padding-left: 20%;
     padding-right: 20%;
     margin-top: 10%;
     padding-bottom: 10%;
     text-align: center;
     font-size: 20px;
   }

   .Bloque2 {
     background: rgba(163, 163, 163, 0.416);
     border-radius: 4px;
   }

.pieDePagina {

 background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
 width: 80%;
 height: 20%;
 border-radius: 4px;
 margin-left: 10%;
}

.pieDePagina img {
 height: 100%;
 width: 100%;
 box-sizing: border-box;
 padding: 5%;
}


 </style>
 </head>
 <body>
   
   <div class="Bloque1">

     <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente a traves de QR o Link personal </h1>
     <div class="Bloque2">
     <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
     <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
     <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
     <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
   </div>
     <h1 class="infoTitulo"> Detalles del Ticket </h1>

      <p class="info">
      ${req.body.descrip} </p>

      <h1 class="infoTitulo"> Detalles de Soporte </h1>

      <p class="info">
     "En proceso." </p>

   
 <div class="pieDePagina">  
   <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

 </div>

   </div>

 
 </body>
</html>
 `

 let AsuntoCoreo = " Se Genero un Ticket Con el numero " + num + "(QR o Link personal)" ;

sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )


//CodigoHLTM
console.log("Correo a" +  resultado[i].correo)
      
}


  }


} )





})


res.send(true)

})


})

////CUANDO NO SE ADJUNTA UNA IMAGEN 

app.post('/sendtiketQR',  multer({ storage: storage }).single('file'), (req, res) => {

  const sql11=`SELECT * FROM intervia WHERE  codigov = '${req.body.Codigov}'`
  conector.query(sql11, function(err,resulttadoCod,filed) {
  console.log(resulttadoCod[0])
  
  obtenerNumeroUnico()
  
  
  let numa = valorFinal;
  let num = "T" + numa;
  let nomape =  `${resulttadoCod[0].nombre} ${resulttadoCod[0].apellido}`;  
  let captura = "";
  
  
   //// CARGA EN LA BASE DE DATOS 
   const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura  ) VALUES (${null}, '${num}','${resulttadoCod[0].empresa}', '${nomape}' , '${resulttadoCod[0].correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}' , '${captura}' )`
   conector.query(sql2, function(err,result,filed) {
       if(err) throw err
       console.log(result)
   })
  
  
   let correo1 =resulttadoCod[0].correo;

   const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
   conector.query(sql1a1, function(err,result2,filed) {
    console.log(result2.empresa)
    console.log("")
    let empresamail = result2[0].empresa;
    let arr = result2[0].valid5.split("");
   
    console.log(arr)
   
    if (arr[0] == "1") {   
   
   
     let ContenidoCorre = `
     <html>
     <head>
     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
     <meta charset="utf-8">
     <style>
       *{
         font-family: 'Poppins', sans-serif;
       }
       body {
         background: rgba(252, 252, 255, 0);
     
       }
   .Bloque1 {
     border: solid rgb(61, 208, 203) 3px;
   padding: 35px;
   width: 50%;
   margin-left: 25%;
   background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
   background-size: cover;
   margin-top: 5%;
   border-radius: 5px;
   }
       
       .Bienvenido {
         width: 100%;
         text-align: center;
          font-size: 18px;
         color: rgb(127, 87, 157);
       }
       .Registrarme {
         width: 50%;
         margin-left: 25%;
         text-align: center;
         display: block;
         text-decoration: none;
         color: black;
         border-bottom: solid 4px #8fdff3 ;
         border-bottom-width: 10%;
         font-size: 15px;
         text-decoration: none;
       }
   
       .infoTitulo {
         color: #413f3fe6;
   margin: 2px;
   border: 0px;
   font-size: 15px;
   text-align: center;
   border-radius: 5px;
       }
   
       .info {
         color: #000000;
         padding-left: 20%;
         padding-right: 20%;
         margin-top: 10%;
         padding-bottom: 10%;
         text-align: center;
         font-size: 20px;
       }
   
       .Bloque2 {
         background: rgba(163, 163, 163, 0.416);
         border-radius: 4px;
       }
   
   .pieDePagina {
   
     background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
     width: 80%;
     height: 20%;
     border-radius: 4px;
     margin-left: 10%;
   }
   
   .pieDePagina img {
     height: 100%;
     width: 100%;
     box-sizing: border-box;
     padding: 5%;
   }
   
   
     </style>
     </head>
     <body>
       
       <div class="Bloque1">
   
         <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente (QR o Link personal) </h1>
         <div class="Bloque2">
         <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
         <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
         <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
         <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
       </div>
         <h1 class="infoTitulo"> Detalles del Ticket </h1>
   
          <p class="info">
          ${req.body.descrip} </p>
   
          <h1 class="infoTitulo"> Detalles de Soporte </h1>
    
          <p class="info">
         "Se les Informo a los Tecnicos que iniciaste un Ticket, Pronto se contactaran contigo." </p>
   
       
     <div class="pieDePagina">  
       <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
   
     </div>
   
       </div>
   
     
     </body>
   </html>
     `
   
   let AsuntoCoreo = " Generaste un Ticket Con el numero " + num + "(QR o Link personal)" ;
   
   sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )
   
   
    //CodigoHLTM
   console.log("Correcto tiene validado resivir notificaciones")
   
    }
   
   
    const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
    conector.query(mailjefes, function(err,result8,filed) { 
      for(i=0; i< result8.length; i++ ){
        let buc = result8[i].valid5.split("");
   
        if (result8[i].valid3 == "1" && buc[1] == "1"  ) {
   
            
   
   
     let ContenidoCorre = `
     <html>
     <head>
     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
     <meta charset="utf-8">
     <style>
       *{
         font-family: 'Poppins', sans-serif;
       }
       body {
         background: rgba(252, 252, 255, 0);
     
       }
   .Bloque1 {
     border: solid rgb(61, 208, 203) 3px;
   padding: 35px;
   width: 50%;
   margin-left: 25%;
   background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
   background-size: cover;
   margin-top: 5%;
   border-radius: 5px;
   }
       
       .Bienvenido {
         width: 100%;
         text-align: center;
          font-size: 18px;
         color: rgb(127, 87, 157);
       }
       .Registrarme {
         width: 50%;
         margin-left: 25%;
         text-align: center;
         display: block;
         text-decoration: none;
         color: black;
         border-bottom: solid 4px #8fdff3 ;
         border-bottom-width: 10%;
         font-size: 15px;
         text-decoration: none;
       }
   
       .infoTitulo {
         color: #413f3fe6;
   margin: 2px;
   border: 0px;
   font-size: 15px;
   text-align: center;
   border-radius: 5px;
       }
   
       .info {
         color: #000000;
         padding-left: 20%;
         padding-right: 20%;
         margin-top: 10%;
         padding-bottom: 10%;
         text-align: center;
         font-size: 20px;
       }
   
       .Bloque2 {
         background: rgba(163, 163, 163, 0.416);
         border-radius: 4px;
       }
   
   .pieDePagina {
   
     background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
     width: 80%;
     height: 20%;
     border-radius: 4px;
     margin-left: 10%;
   }
   
   .pieDePagina img {
     height: 100%;
     width: 100%;
     box-sizing: border-box;
     padding: 5%;
   }
   
   
     </style>
     </head>
     <body>
       
       <div class="Bloque1">
   
         <h1 class="Bienvenido"> Se genero un nuevo Ticket : ${num}  </h1>
         <div class="Bloque2">
         <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
         <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
         <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
         <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
       </div>
         <h1 class="infoTitulo"> Detalles del Ticket </h1>
   
          <p class="info">
          ${req.body.descrip} </p>
   
          <h1 class="infoTitulo"> Detalles de Soporte </h1>
    
          <p class="info">
         "El ticket esta en proceso, se alertara a los tecnicos del problema." </p>
   
       
     <div class="pieDePagina">  
       <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
   
     </div>
   
       </div>
   
     
     </body>
   </html>
     `
   
     let AsuntoCoreo = "Se genero un Ticket : " + num   ;
   
   sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )
   
   
    //CodigoHLTM
   console.log("Correo a" +  result8[i].correo)
         
   
        }
   
   
      }
   
   
    } )
   
   
    const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
    conector.query(admins, function(err,resultado,filed) { 
      for(i=0; i< resultado.length; i++ ){
        let buc = resultado[i].valid5.split("");
   
        if (resultado[i].valid4 == "1" && buc[3] == "1"  ) {
   
   console.log("Correo para administradores enviado correctamente")
   
     let ContenidoCorre = `
     <html>
     <head>
     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
     <meta charset="utf-8">
     <style>
       *{
         font-family: 'Poppins', sans-serif;
       }
       body {
         background: rgba(252, 252, 255, 0);
     
       }
   .Bloque1 {
     border: solid rgb(61, 208, 203) 3px;
   padding: 35px;
   width: 50%;
   margin-left: 25%;
   background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
   background-size: cover;
   margin-top: 5%;
   border-radius: 5px;
   }
       
       .Bienvenido {
         width: 100%;
         text-align: center;
          font-size: 18px;
         color: rgb(127, 87, 157);
       }
       .Registrarme {
         width: 50%;
         margin-left: 25%;
         text-align: center;
         display: block;
         text-decoration: none;
         color: black;
         border-bottom: solid 4px #8fdff3 ;
         border-bottom-width: 10%;
         font-size: 15px;
         text-decoration: none;
       }
   
       .infoTitulo {
         color: #413f3fe6;
   margin: 2px;
   border: 0px;
   font-size: 15px;
   text-align: center;
   border-radius: 5px;
       }
   
       .info {
         color: #000000;
         padding-left: 20%;
         padding-right: 20%;
         margin-top: 10%;
         padding-bottom: 10%;
         text-align: center;
         font-size: 20px;
       }
   
       .Bloque2 {
         background: rgba(163, 163, 163, 0.416);
         border-radius: 4px;
       }
   
   .pieDePagina {
   
     background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
     width: 80%;
     height: 20%;
     border-radius: 4px;
     margin-left: 10%;
   }
   
   .pieDePagina img {
     height: 100%;
     width: 100%;
     box-sizing: border-box;
     padding: 5%;
   }
   
   
     </style>
     </head>
     <body>
       
       <div class="Bloque1">
   
         <h1 class="Bienvenido"> Ticket ${num} Iniciado Correctamente a traves de QR o Link personal </h1>
         <div class="Bloque2">
         <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
         <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
         <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
         <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
       </div>
         <h1 class="infoTitulo"> Detalles del Ticket </h1>
   
          <p class="info">
          ${req.body.descrip} </p>
   
          <h1 class="infoTitulo"> Detalles de Soporte </h1>
    
          <p class="info">
         "En proceso." </p>
   
       
     <div class="pieDePagina">  
       <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
   
     </div>
   
       </div>
   
     
     </body>
   </html>
     `
   
     let AsuntoCoreo = " Se Genero un Ticket Con el numero " + num + "(QR o Link personal)" ;
   
   sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )
   
   
    //CodigoHLTM
   console.log("Correo a" +  resultado[i].correo)
          
   }
   
   
      }
   
   
    } )
   
   
   
   
   
   })
   
   
   res.send(true)
   
   })
  
  
    })


// Ticket iniciado por administrador con y sin imagenes



app.post('/sendtiketadmin',  function(req,res){ 

obtenerNumeroUnico()
let nota = req.body.nota;
let captura = "";
let numa = valorFinal;
let num = "T" + numa;
let nomape =  `${req.body.nombre} ${req.body.apellido}`;

console.log(nota)
if (nota.trim() !== "") {
 


setTimeout(function() {
  HilodeSoporte(nota, num, req.session.nombre);
}, 1000);

} else {
console.log("La nota está vacía");
}




//// CARGA EN LA BASE DE DATOS 
const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura ) VALUES (${null}, '${num}','${req.body.empresa}', '${nomape}' , '${req.body.correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}','${captura}')`
conector.query(sql2, function(err,result,filed) {
   if(err) throw err
   console.log(result)
})

if( EmailMarcha[1]==1){

correo1 = req.body.correo;


const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
conector.query(sql1a1, function(err,result2,filed) {
console.log(result2.empresa)
console.log("")
let empresamail = result2[0].empresa;
let arr = result2[0].valid5.split("");

console.log(arr)

if (arr[3] == "1") {   


let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado Por un Administrador </h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "Este Ticket Fue iniciado por un Administrador / Tecnico de Intervia" </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = "Ticket " + num + " Generado por un Administrador de Intervia";

sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )




}


const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
conector.query(mailjefes, function(err,result8,filed) { 
 for(i=0; i< result8.length; i++ ){
   let buc = result8[i].valid5.split("");

   if (result8[i].valid3 == "1" && buc[4] == "1"  ) {

       


let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado por un administrador de intervia </h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "En proceso." </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = "Ticket " + num + " Generado por un Administrador de Intervia";

sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )


//CodigoHLTM
console.log("Correo a" +  result8[i].correo)
    

   }


 }


} )


const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(admins, function(err,resultado,filed) { 
 for(i=0; i< resultado.length; i++ ){
   let buc = resultado[i].valid5.split("");

   if (resultado[i].valid4 == "1" && buc[5] == "1"  ) {

console.log("Correo para administradores enviado correctamente")

let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgba(252, 252, 255, 0);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
     font-size: 18px;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }

  .infoTitulo {
    color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
  }

  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
    text-align: center;
    font-size: 20px;
  }

  .Bloque2 {
    background: rgba(163, 163, 163, 0.416);
    border-radius: 4px;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">

    <h1 class="Bienvenido"> Ticket ${num} Iniciado por un Administrador</h1>
    <div class="Bloque2">
    <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
    <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
    <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
    <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
  </div>
    <h1 class="infoTitulo"> Detalles del Ticket </h1>

     <p class="info">
     ${req.body.descrip} </p>

     <h1 class="infoTitulo"> Detalles de Soporte </h1>

     <p class="info">
    "En proceso." </p>

  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = "Ticket" + num + "Generado por un Administrador de Intervia";

sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )


//CodigoHLTM
console.log("Correo a" +  resultado[i].correo)
     
}


 }


} )





})




}  res.send(true)   })





app.post('/sendtiketimgadmin',  multer({ storage: storage }).single('file'), (req, res) => {

obtenerNumeroUnico()

var img = req.body.imagen;
var imgBuffer = Buffer.from(img, 'base64');
//crea un archivo temporal
var tempFile = './uploads/tempfile'
fs.writeFileSync(tempFile, imgBuffer);
var upload = multer({ dest: 'uploads/' }).single('file');
upload(req, res, function (err) {
  fs.unlinkSync(tempFile);
});



let numa = valorFinal;
let num = "T" + numa;
let nomape =  `${req.body.nombre} ${req.body.apellido}`;
let imgtk = "IM" + num; 
let nota = req.body.nota;

if (nota.trim() !== "") {
 


setTimeout(function() {
  HilodeSoporte(nota, num, req.session.nombre);
}, 1000);
}

const tiketfinal = req.body;
const imageData = tiketfinal.imagen;
const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
const buffer = Buffer.from(base64Data, 'base64');
fs.writeFileSync('uploads/'+imgtk+'.jpg', buffer);
let correo1 = req.body.correo


 //// CARGA EN LA BASE DE DATOS 
 const sql2=`INSERT INTO tikets (id, ntiket , empresa , nomape , correo , asunto , descripcion , Fecha , estado , tiempo , captura ) VALUES (${null}, '${num}','${req.body.empresa}', '${nomape}' , '${req.body.correo}' , '${req.body.asunto}' , '${req.body.descrip}','${req.body.fecha}', '${req.body.estado}', '${null}','${imgtk}')`
 conector.query(sql2, function(err,result,filed) {
     if(err) throw err
     console.log(result)
 })
 if( EmailMarcha[1]==1){

  correo1 = req.body.correo;
  
  
  const sql1a1=`SELECT * FROM intervia WHERE  correo = '${correo1}'`
  conector.query(sql1a1, function(err,result2,filed) {
   console.log(result2.empresa)
   console.log("")
   let empresamail = result2[0].empresa;
   let arr = result2[0].valid5.split("");
  
   console.log(arr)
  
   if (arr[3] == "1") {   
  
  
    let ContenidoCorre = `
    <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
      *{
        font-family: 'Poppins', sans-serif;
      }
      body {
        background: rgba(252, 252, 255, 0);
    
      }
  .Bloque1 {
    border: solid rgb(61, 208, 203) 3px;
  padding: 35px;
  width: 50%;
  margin-left: 25%;
  background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
  background-size: cover;
  margin-top: 5%;
  border-radius: 5px;
  }
      
      .Bienvenido {
        width: 100%;
        text-align: center;
         font-size: 18px;
        color: rgb(127, 87, 157);
      }
      .Registrarme {
        width: 50%;
        margin-left: 25%;
        text-align: center;
        display: block;
        text-decoration: none;
        color: black;
        border-bottom: solid 4px #8fdff3 ;
        border-bottom-width: 10%;
        font-size: 15px;
        text-decoration: none;
      }
  
      .infoTitulo {
        color: #413f3fe6;
  margin: 2px;
  border: 0px;
  font-size: 15px;
  text-align: center;
  border-radius: 5px;
      }
  
      .info {
        color: #000000;
        padding-left: 20%;
        padding-right: 20%;
        margin-top: 10%;
        padding-bottom: 10%;
        text-align: center;
        font-size: 20px;
      }
  
      .Bloque2 {
        background: rgba(163, 163, 163, 0.416);
        border-radius: 4px;
      }
  
  .pieDePagina {
  
    background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
    width: 80%;
    height: 20%;
    border-radius: 4px;
    margin-left: 10%;
  }
  
  .pieDePagina img {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 5%;
  }
  
  
    </style>
    </head>
    <body>
      
      <div class="Bloque1">
  
        <h1 class="Bienvenido"> Ticket ${num} Iniciado Por un Administrador </h1>
        <div class="Bloque2">
        <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
        <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
        <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
        <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
      </div>
        <h1 class="infoTitulo"> Detalles del Ticket </h1>
  
         <p class="info">
         ${req.body.descrip} </p>
  
         <h1 class="infoTitulo"> Detalles de Soporte </h1>
   
         <p class="info">
        "Este Ticket Fue iniciado por un Administrador / Tecnico de Intervia" </p>
  
      
    <div class="pieDePagina">  
      <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
  
    </div>
  
      </div>
  
    
    </body>
  </html>
    `
  
    let AsuntoCoreo = "Ticket " + num + " Generado por un Administrador de Intervia";
  
  sendEmail(AsuntoCoreo, ContenidoCorre , correo1 )
  
  
  
  
   }
  
  
   const mailjefes=`SELECT * FROM intervia WHERE  empresa = '${empresamail}'`
   conector.query(mailjefes, function(err,result8,filed) { 
     for(i=0; i< result8.length; i++ ){
       let buc = result8[i].valid5.split("");
  
       if (result8[i].valid3 == "1" && buc[4] == "1"  ) {
  
           
  
  
    let ContenidoCorre = `
    <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
      *{
        font-family: 'Poppins', sans-serif;
      }
      body {
        background: rgba(252, 252, 255, 0);
    
      }
  .Bloque1 {
    border: solid rgb(61, 208, 203) 3px;
  padding: 35px;
  width: 50%;
  margin-left: 25%;
  background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
  background-size: cover;
  margin-top: 5%;
  border-radius: 5px;
  }
      
      .Bienvenido {
        width: 100%;
        text-align: center;
         font-size: 18px;
        color: rgb(127, 87, 157);
      }
      .Registrarme {
        width: 50%;
        margin-left: 25%;
        text-align: center;
        display: block;
        text-decoration: none;
        color: black;
        border-bottom: solid 4px #8fdff3 ;
        border-bottom-width: 10%;
        font-size: 15px;
        text-decoration: none;
      }
  
      .infoTitulo {
        color: #413f3fe6;
  margin: 2px;
  border: 0px;
  font-size: 15px;
  text-align: center;
  border-radius: 5px;
      }
  
      .info {
        color: #000000;
        padding-left: 20%;
        padding-right: 20%;
        margin-top: 10%;
        padding-bottom: 10%;
        text-align: center;
        font-size: 20px;
      }
  
      .Bloque2 {
        background: rgba(163, 163, 163, 0.416);
        border-radius: 4px;
      }
  
  .pieDePagina {
  
    background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
    width: 80%;
    height: 20%;
    border-radius: 4px;
    margin-left: 10%;
  }
  
  .pieDePagina img {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 5%;
  }
  
  
    </style>
    </head>
    <body>
      
      <div class="Bloque1">
  
        <h1 class="Bienvenido"> Ticket ${num} Iniciado por un administrador de intervia </h1>
        <div class="Bloque2">
        <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
        <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
        <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
        <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
      </div>
        <h1 class="infoTitulo"> Detalles del Ticket </h1>
  
         <p class="info">
         ${req.body.descrip} </p>
  
         <h1 class="infoTitulo"> Detalles de Soporte </h1>
   
         <p class="info">
        "En proceso." </p>
  
      
    <div class="pieDePagina">  
      <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
  
    </div>
  
      </div>
  
    
    </body>
  </html>
    `
  
    let AsuntoCoreo = "Ticket " + num + " Generado por un Administrador de Intervia";
  
  sendEmail(AsuntoCoreo, ContenidoCorre , result8[i].correo )
  
  
   //CodigoHLTM
  console.log("Correo a" +  result8[i].correo)
        
  
       }
  
  
     }
  
  
   } )
  
  
   const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
   conector.query(admins, function(err,resultado,filed) { 
     for(i=0; i< resultado.length; i++ ){
       let buc = resultado[i].valid5.split("");
  
       if (resultado[i].valid4 == "1" && buc[5] == "1"  ) {
  
  console.log("Correo para administradores enviado correctamente")
  
    let ContenidoCorre = `
    <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
      *{
        font-family: 'Poppins', sans-serif;
      }
      body {
        background: rgba(252, 252, 255, 0);
    
      }
  .Bloque1 {
    border: solid rgb(61, 208, 203) 3px;
  padding: 35px;
  width: 50%;
  margin-left: 25%;
  background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
  background-size: cover;
  margin-top: 5%;
  border-radius: 5px;
  }
      
      .Bienvenido {
        width: 100%;
        text-align: center;
         font-size: 18px;
        color: rgb(127, 87, 157);
      }
      .Registrarme {
        width: 50%;
        margin-left: 25%;
        text-align: center;
        display: block;
        text-decoration: none;
        color: black;
        border-bottom: solid 4px #8fdff3 ;
        border-bottom-width: 10%;
        font-size: 15px;
        text-decoration: none;
      }
  
      .infoTitulo {
        color: #413f3fe6;
  margin: 2px;
  border: 0px;
  font-size: 15px;
  text-align: center;
  border-radius: 5px;
      }
  
      .info {
        color: #000000;
        padding-left: 20%;
        padding-right: 20%;
        margin-top: 10%;
        padding-bottom: 10%;
        text-align: center;
        font-size: 20px;
      }
  
      .Bloque2 {
        background: rgba(163, 163, 163, 0.416);
        border-radius: 4px;
      }
  
  .pieDePagina {
  
    background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
    width: 80%;
    height: 20%;
    border-radius: 4px;
    margin-left: 10%;
  }
  
  .pieDePagina img {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 5%;
  }
  
  
    </style>
    </head>
    <body>
      
      <div class="Bloque1">
  
        <h1 class="Bienvenido"> Ticket ${num} Iniciado por un Administrador</h1>
        <div class="Bloque2">
        <h1 class="infoTitulo"> Ticket : ${num} Usuario:${result2[0].nombre}  </h1>
        <h1 class="infoTitulo"> Correo :${result2[0].correo} Empresa: ${result2[0].empresa} </h1>
        <h1 class="infoTitulo"> Estado :${req.body.estado} Fecha: ${req.body.fecha} </h1>
        <h1 class="infoTitulo"> Asunto : ${req.body.asunto}  </h1>
      </div>
        <h1 class="infoTitulo"> Detalles del Ticket </h1>
  
         <p class="info">
         ${req.body.descrip} </p>
  
         <h1 class="infoTitulo"> Detalles de Soporte </h1>
   
         <p class="info">
        "En proceso." </p>
  
      
    <div class="pieDePagina">  
      <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
  
    </div>
  
      </div>
  
    
    </body>
  </html>
    `
  
    let AsuntoCoreo = "Ticket" + num + "Generado por un Administrador de Intervia";
  
  sendEmail(AsuntoCoreo, ContenidoCorre , resultado[i].correo )
  
  
   //CodigoHLTM
  console.log("Correo a" +  resultado[i].correo)
         
  }
  
  
     }
  
  
   } )
  
  
  
  
  
  })
  
  
  
  
  }  res.send(true)   })


/// HISTORIAL DE LOS TIKETS SOLICITADOS POR EL USUARIO


app.post('/historial',  function(req,res){  

console.log("solicitud de historial")
const sql3=`SELECT * FROM tikets WHERE  correo = '${req.session.correo}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})
})
/// HISTORIAL DE LOS TIKETS SOLICITADOS POR EL USUARIO

app.post('/historialp',  function(req,res){  

console.log(req.body.empresa)


const sql3=`SELECT * FROM tikets WHERE  empresa = '${req.body.empresa}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})


app.post('/historialpn2',  function(req,res){  

let empresa = req.session.empresa;


const sql3=`SELECT * FROM tikets WHERE  empresa = '${empresa}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})





///VALIDAR SI POSEE LOS PERMISOS PARA REVISAR EL HISTORIAL

app.get('/historialv',  function(req,res){ 



if(req.session.online == true && req.session.valid2 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "historial.html"));
    


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})


app.get('/historialcelulares',  function(req,res){ 



if(req.session.online == true && req.session.valid2 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "HistorialParticularCelulares.html"));
    


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})
///// HISTORIAL GLOBAL 


app.get('/historialg',  function(req,res){ 



if(req.session.online == true && req.session.valid3 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "historialg.html"));
    


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})

////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/historialgl',  function(req,res){  
console.log("solicitud de historial")
const sql3=`SELECT * FROM tikets `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})
})
//////////////////// HISTPRIAL POR EMPRESA

app.get('/txempresa',  function(req,res){ 

console.log("t x empresa")

if(req.session.online == true && req.session.valid4 == 1 ) {

    res.sendFile(path.resolve(__dirname,"tikets" , "txempresa.html"));
    


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})





//// PERMISOS PARA UN USUARIO NIVEL 2  y   3

app.get('/panel',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "paneln4.html"));
    


} else if (req.session.online == true && req.session.valid3 == 1) { res.sendFile(path.resolve(__dirname,"tikets" ,"panel.html"))}

else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),); }


})


//// Eliminar 

app.post('/delet',  function(req,res){  

let tiket = req.body.tiket ;

console.log(tiket) 

const sql3=`DELETE FROM tikets WHERE  ntiket = '${tiket}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2);
res.send(true) }

) } ) 
///// DELETE USUARIOS

app.post('/deletu',  function(req,res){  

let correo = req.body.correo ;



const sql3=`DELETE FROM intervia WHERE correo = '${correo}' `
  conector.query(sql3, function(err,result2,filed) {
  if (err) throw err
  console.log(result2);
  res.send(true)  }



) }     ) 

app.post('/deletem',  function(req,res){  

let id = req.body.id ;
console.log(id)



const sql3=`DELETE FROM empresa WHERE empresa = '${id}' `
  conector.query(sql3, function(err,result2,filed) {
  if (err) throw err
  console.log(result2); }

) } ) ;


// LISTA DE USUARIOS sitio en el backend

app.get('/lusuarios',  function(req,res){  

if(req.session.online == true && req.session.valid4 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" , "lusuarios.html"));
    
    console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


} ) 

//// LISTA DE USUARIOS JSON  NIVEL 3
app.post('/listausu',  function(req,res){  

const sql3=`SELECT * FROM intervia `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})


} ) 



//// LISTA DE USUARIOS JSON  NIVEL 2
app.post('/listausun2',  function(req,res){  



let usu = req.session.empresa;

const sql3=`SELECT * FROM intervia WHERE  empresa = '${usu}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})


} ) 


/// SOLICITUD DE USUARIOS POR EMPRESA PARA GENERAR UN NUEVO TIKET

app.post('/listausun10',  function(req,res){  



let usu = req.body.empresa;
console.log(usu)

const sql3=`SELECT * FROM intervia WHERE  empresa = '${usu}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})


} ) 


app.post('/listausun11',  function(req,res){  





let usu = req.body.correo;
console.log(usu)

const sql3=`SELECT * FROM intervia WHERE  correo = '${usu}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) 



})


} ) 



/////////////// EMPRESAS  //////////////

app.get('/empresas',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1 ) {

  res.sendFile(path.resolve(__dirname,"tikets" , "empresas.html"));
  


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})




///// HISTORIAL NIVEL 2

app.get('/historiale',  function(req,res){  

res.sendFile(path.resolve(__dirname,"tikets" ,"historiale.html"),);


} ) 


///////////  INGRESO DE EMPRESA

app.post('/ingempresa',  function(req,res){  
let valid6 = ""; // por si sirve.
dominio = req.body.dominio;
empresa  =  req.body.empresa;
let numa = req.body.abonado;
console.log(empresa)
const sql2=`INSERT INTO empresa (id , empresa , dominio , valid5 , valid6 ) VALUES (${null}, '${empresa}','${dominio}' , '${numa}' ,  '${valid6}' )`
conector.query(sql2, function(err,result,filed) {
    if(err) throw err
    console.log(result)

} ) 

res.send(true)

})

//// LISTA DE EMPRESAS   (codigo obsoleto)

app.post('/solicitudemp',  function(req,res){ 

const sql3=`SELECT * FROM empresa `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) })



})

/// NOMBRE DE EMPRESA POR CODIGO 


app.post('/solicitudempcod',  function(req,res){ 

console.log(req.body.empresa + "empresa" )
const sql3=`SELECT * FROM empresa WHERE  dominio = '${req.body.empresa}'`
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2) })




})


app.post('/solicitudempcoduu',  function(req,res){ 

console.log(req.body.empresa)
    const sql3=`SELECT * FROM empresa WHERE  empresa = '${req.body.empresa}'`
    conector.query(sql3, function(err,result2,filed) {
    if (err) throw err
    console.log(result2); 
    res.send(result2) })



 })







////////////// AUMENTAR EL NIVEL DEL USUARIO NIVEL 3

app.post('/uplevel',  function(req,res){  

nivel1 = req.body.nivel;
console.log(nivel1)
correo = req.body.correo;
up = req.body.up;



if ( nivel1 == "Nivel 0" && up == true ) {     
const sql2= `UPDATE intervia set valid2= "1" WHERE correo='${correo}'`
conector.query(sql2, function(err,result,filed) {
    if (err) throw err
    console.log(result[0])});}


else if ( nivel1 == "Nivel 1"&& up == true) {     

console.log("go")
const sql2= `UPDATE intervia set valid3= "1" WHERE correo='${correo}'`
conector.query(sql2, function(err,result,filed) {
    if (err) throw err
    console.log(result[0])});


}
else  if ( nivel1 == "Nivel 2"&& up == true) {   
const sql2= `UPDATE intervia set valid4= "1" WHERE correo='${correo}'`
conector.query(sql2, function(err,result,filed) {
    if (err) throw err
    console.log(result[0])});


   }
   else  if ( nivel1 == "Nivel 3"&& up == true) {     


console.log("no se puede aumentar mas el nivel")

 }

  else if ( nivel1 == "Nivel 0" && up == false ) {     
    console.log("no se puede bajar mas el nivel") }


  else if ( nivel1 == "Nivel 1" && up == false) {     
    
    const sql2= `UPDATE intervia set valid2= "0" WHERE correo='${correo}'`
    conector.query(sql2, function(err,result,filed) {
        if (err) throw err
        console.log(result[0])});


   }
   else  if ( nivel1 == "Nivel 2"&& up == false) {   

    const sql2= `UPDATE intervia set valid3= "0" WHERE correo='${correo}'`
    conector.query(sql2, function(err,result,filed) {
        if (err) throw err
        console.log(result[0])});


       }
       else  if ( nivel1 == "Nivel 3" && up == false) { 
        const sql2= `UPDATE intervia set valid4= "0" WHERE correo='${correo}'`
       conector.query(sql2, function(err,result,filed) {
           if (err) throw err
           console.log(result[0])});
           

     }
     res.send(true)


})


/////////////////  AUMENTAR EL NIVEL DEL USUARIO NIVEL 2

app.post('/upleveln2',  function(req,res){  

nivel1 = req.body.nivel;
console.log(nivel1)
correo = req.body.correo;
up = req.body.up;



if ( nivel1 == "Nivel 0" && up == true ) {     
  const sql2= `UPDATE intervia set valid2= "1" WHERE correo='${correo}'`
  conector.query(sql2, function(err,result,filed) {
      if (err) throw err
      console.log(result[0])});}


else if ( nivel1 == "Nivel 1"&& up == true) {     
  
  console.log("go")
  const sql2= `UPDATE intervia set valid3= "1" WHERE correo='${correo}'`
  conector.query(sql2, function(err,result,filed) {
      if (err) throw err
      console.log(result[0])});


 }
 else  if ( nivel1 == "Nivel 2"&& up == true) {   

  console.log("no se puede aumentar mas el nivel")


     }
     else  if ( nivel1 == "Nivel 3"&& up == true) {     


console.log("no se puede aumentar mas el nivel")

   }

    else if ( nivel1 == "Nivel 0" && up == false ) {     
      console.log("no se puede bajar mas el nivel") }
  
  
    else if ( nivel1 == "Nivel 1" && up == false) {     
      
      const sql2= `UPDATE intervia set valid2= "0" WHERE correo='${correo}'`
      conector.query(sql2, function(err,result,filed) {
          if (err) throw err
          console.log(result[0])});
  
  
     }
     else  if ( nivel1 == "Nivel 2"&& up == false) {   
  
      const sql2= `UPDATE intervia set valid3= "0" WHERE correo='${correo}'`
      conector.query(sql2, function(err,result,filed) {
          if (err) throw err
          console.log(result[0])});
  
  
         }
         else  if ( nivel1 == "Nivel 3" && up == false) { 
          const sql2= `UPDATE intervia set valid4= "0" WHERE correo='${correo}'`
         conector.query(sql2, function(err,result,filed) {
             if (err) throw err
             console.log(result[0])});
             
  
       }
       res.send(true)


})


//// DESACTIVAR LAS NOTIFICACIONES POR CORREO


app.post('/desactnoti',  function(req,res){ 
correo = req.session.correo
const sql3=`UPDATE intervia set valid5= "00000000000000" WHERE correo='${correo}'`
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(true) })



})


////////// ACTUALIZACION DE TIKET 

app.post('/uptiket', async function(req,res){ 
  let tiket = req.body.tiket;

  console.log(tiket)


if (req.body.presupuetar == true) {   
  setTimeout(() => {
  presupuestar(tiket);
      }, 7000); }
  

      function resolverstock(nt) {

        const sql6 = `SELECT * FROM stock WHERE entregado = '${nt}'`;
    
        conector.query(sql6, function(err, resultstock, filed) {
          if (resultstock == "") {
    
           paragraphs = '<p class="infoS"> Sin uso de stock </p>';
           return (paragraphs)
    
          } else {
            for (let i = 0; i < resultstock.length; i++) {
    
              paragraphs+= `<p class="infoS">${resultstock[i].categoria} ${resultstock[i].descripcion} ${resultstock[i].sn}</p>`;
    
            } 
            console.log(paragraphs)
            return (paragraphs)
          } }) 
        
      
        }


        
let facturardes = req.body.facturardes;
let facturar = req.body.facturar;

let select = req.body.select.toString(); 


///////////// esto debe ser transformado a hilo ////

let actual = req.body.actual; 
let nombresession =  req.session.nombre;

let fadebol =  Boolean(facturardes.length);
let actualbol= Boolean(actual.length);
paragraphs = "";

if (actualbol == true) {   HilodeSoporte(actual, tiket, nombresession);}


resolverstock(tiket)
setTimeout(() => {
  infostock = paragraphs;
  console.log(infostock)
}, 2000);






 













function selectoff() { if (select != "Estado"){return true}else{return false}}

   ////// Aqui podemos filtrar que actualizar y que no.

if (actualbol==true && fadebol == true && facturar==true && selectoff() == true){ 
console.log( "Todo modificado")
   const sql= `UPDATE tikets set estado='${select}', facturacion1='${facturar}' ,  facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
   conector.query(sql, function(err,result,filed) {
      if (err) throw err
       console.log("echo");
      res.send(true)
   })  } else if (actualbol==false && fadebol == true && facturar==true && selectoff() == true){ 
    console.log( "Todo modificado menus la actualizacion")
         const sql= `UPDATE tikets set  estado='${select}', facturacion1='${facturar}' ,  facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
         conector.query(sql, function(err,result,filed) {
            if (err) throw err
             console.log("echo");
            res.send(true)
         })  } 
         
        else if (actualbol==true && fadebol == true && facturar == true && selectoff() == false){ 
          console.log( "Todo modificado menus la el estado")
               const sql= `UPDATE tikets set  facturacion1='${facturar}' ,  facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
               conector.query(sql, function(err,result,filed) {
                  if (err) throw err
                   console.log("echo");
                  res.send(true)
               })  } 
               else if (actualbol==false && fadebol == true && facturar == true && selectoff() == false){ 
                console.log( "Todo modificado menus la el estado")
                     const sql= `UPDATE tikets set  facturacion1='${facturar}' ,  facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
                     conector.query(sql, function(err,result,filed) {
                        if (err) throw err
                         console.log("echo");
                        res.send(true)
                     })  }  else if (actualbol==false && fadebol == true && facturar == false && selectoff() == true){ 
                      console.log( "factudes y select modificado")
                           const sql= `UPDATE tikets set estado='${select}' , facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
                           conector.query(sql, function(err,result,filed) {
                              if (err) throw err
                               console.log("echo");
                              res.send(true)
                           })  } else if (actualbol==true && fadebol == false && facturar == false && selectoff() == true){ 
                            console.log( "actualizacion mas estado")
                                 const sql= `UPDATE tikets set estado='${select}'  WHERE  ntiket= '${tiket}'  `
                                 conector.query(sql, function(err,result,filed) {
                                    if (err) throw err
                                     console.log("echo");
                                    res.send(true)
                                 })  }  else if (actualbol==true && fadebol == true && facturar == false && selectoff() == false){ 
                                  console.log( "los 2 imput y nada mas")
                                       const sql= `UPDATE tikets set facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
                                       conector.query(sql, function(err,result,filed) {
                                          if (err) throw err
                                           console.log("echo");
                                          res.send(true)
                                       })  } else if (actualbol==true && fadebol == false && facturar == true && selectoff() == false){ 
                                        console.log( "los 2 imput y nada mas")
                                             const sql= `UPDATE tikets set facturacion1='${facturar}' WHERE  ntiket= '${tiket}'  `
                                             conector.query(sql, function(err,result,filed) {
                                                if (err) throw err
                                                 console.log("echo");
                                                res.send(true)
                                             })  } else if (actualbol==false && fadebol == false && facturar == true && selectoff() == true){ 
                                              console.log( "estado y facturacion en true")
                                                   const sql= `UPDATE tikets set estado='${select}' ,  facturacion1='${facturar}' WHERE  ntiket= '${tiket}'  `
                                                   conector.query(sql, function(err,result,filed) {
                                                      if (err) throw err
                                                       console.log("echo");
                                                      res.send(true)
                                                   })  } else if (actualbol==true && fadebol == false && facturar == false && selectoff() == true){ 
                                                    console.log( "estado y facturacion en true")
                                                         const sql= `UPDATE tikets set estado='${select}' WHERE  ntiket= '${tiket}'  `
                                                         conector.query(sql, function(err,result,filed) {
                                                            if (err) throw err
                                                             console.log("echo");
                                                            res.send(true)
                                                         })  }  else if (actualbol==true && fadebol == false && facturar == true && selectoff() == true){ 
                                                          console.log( "estado y facturacion en true")  ///cambiar
                                                               const sql= `UPDATE tikets set facturacion1='${facturar}', estado='${select}' WHERE  ntiket= '${tiket}'  `
                                                               conector.query(sql, function(err,result,filed) {
                                                                  if (err) throw err
                                                                   console.log("echo");
                                                                  res.send(true)
                                                               })  }  else if (actualbol==true && fadebol == false && facturar == false && selectoff() == false){ 
                                                          console.log( "Aqui no debe hacer nada")
                                                                  res.send(true)
                                                               }  else if (actualbol==false && fadebol == true && facturar == false && selectoff() == false){ 
                                                                console.log( "estado y facturacion en true")
                                                                     const sql= `UPDATE tikets set facturacion2='${facturardes}' WHERE  ntiket= '${tiket}'  `
                                                                     conector.query(sql, function(err,result,filed) {
                                                                        if (err) throw err
                                                                         console.log("echo");
                                                                        res.send(true)
                                                                     })  }  else if (actualbol==false && fadebol == false && facturar == true && selectoff() == false){ 
                                                                      console.log( "estado y facturacion en true")
                                                                           const sql= `UPDATE tikets set facturacion1='${facturar}' WHERE  ntiket= '${tiket}'  `
                                                                           conector.query(sql, function(err,result,filed) {
                                                                              if (err) throw err
                                                                               console.log("echo");
                                                                              res.send(true)
                                                                           })  } else if (actualbol==false && fadebol == false && facturar == false && selectoff() == true){ 
                                                                            console.log( "estado y facturacion en true")
                                                                                 const sql= `UPDATE tikets set estado='${select}' WHERE  ntiket= '${tiket}'  `
                                                                                 conector.query(sql, function(err,result,filed) {
                                                                                    if (err) throw err
                                                                                     console.log("echo");
                                                                                    res.send(true)
                                                                                 })  } else if (actualbol==false && fadebol == false && facturar == false && selectoff() == true){ 
                                                                                  console.log( "estado y facturacion en true")
                                                                                       const sql= `UPDATE tikets set estado='${select}' WHERE  ntiket= '${tiket}'  `
                                                                                       conector.query(sql, function(err,result,filed) {
                                                                                          if (err) throw err
                                                                                           console.log("echo");
                                                                                          res.send(true)
                                                                                       })  } else if  (actualbol==true && fadebol == true && facturar == false && selectoff() == true){ 
                                                                                        const sql= `UPDATE tikets set facturacion2='${facturardes}', estado='${select}' WHERE  ntiket= '${tiket}'  `
                                                                                             conector.query(sql, function(err,result,filed) {
                                                                                                if (err) throw err
                                                                                                 console.log("echo");
                                                                                                res.send(true)
                                                                                             })  }  else if (actualbol==false && fadebol == false && facturar == false && selectoff() == false){ 
                                                                                  console.log( "No cambia nada")
                                                                                       
                                                                                         
                                                                                          res.send(false)
                                                                                         }
      
setTimeout(() => {
EnviodeMails(tiket);
  }, 5000);

function  EnviodeMails(ticket1) {

console.log(ticket1)


   const sql5=`SELECT * FROM tikets WHERE  ntiket = '${ticket1}'`
   conector.query(sql5, function(err,resulttiket,filed) {

    const sql55=`SELECT * FROM intervia WHERE  correo = '${resulttiket[0].correo}'`
   conector.query(sql55, function(err,result10,filed) { 
    let arr = result10[0].valid5.split("");


   if ( select == "Finalizado" && arr[6] == "1" ) { 

    console.log("Finalizado" + ticket1)

    let ContenidoCorre = `
    <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
    *{
      font-family: 'Poppins', sans-serif;
    }
    body {
      background: rgba(252, 252, 255, 0);
  
    }
.Bloque1 {
  border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
    
    .Bienvenido {
      width: 100%;
      text-align: center;
       font-size: 18px;
      color: rgb(127, 87, 157);
    }
    .Registrarme {
      width: 50%;
      margin-left: 25%;
      text-align: center;
      display: block;
      text-decoration: none;
      color: black;
      border-bottom: solid 4px #8fdff3 ;
      border-bottom-width: 10%;
      font-size: 15px;
      text-decoration: none;
    }

    .infoTitulo {
      color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
    }

    .info {
      color: #000000;
      padding-left: 20%;
      padding-right: 20%;
      margin-top: 10%;
      padding-bottom: 10%;
      text-align: center;
      font-size: 20px;
    }


    
    .infoS {
      color: #000000;
  padding-left: 20%;
  padding-right: 20%;
  margin-top: 1%;
  padding-bottom: 0%;
  text-align: center;
  font-size: 20px;
    }


    .Bloque2 {
      background: rgba(163, 163, 163, 0.416);
      border-radius: 4px;
    }

.pieDePagina {

  background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
  width: 80%;
  height: 20%;
  border-radius: 4px;
  margin-left: 10%;
}

.pieDePagina img {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 5%; 
}


.TituloHilo {
  background-color: #333; /* Color de fondo oscuro */
  color: #fff; /* Texto en blanco */
  font-size: 1.2em; /* Aumentar tamaño de fuente */
  padding: 10px; /* Relleno en todos los lados */
  border-radius: 5px; /* Bordes redondeados */
  margin: 10px 0; /* Margen superior e inferior */
  border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
  text-align: center;
}

.InfoHilo {
  text-align: center;
  background-color: #f9f9f9; /* Color de fondo claro */
  color: #333; /* Texto oscuro */
  padding: 8px; /* Relleno en todos los lados */
  border-radius: 5px; /* Bordes redondeados */
  margin-top: 5px; /* Margen superior */
}

.bloque-ticket {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 20px auto;
  background-color: #f9f9f9;
}

.titulo-principal {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
  border-bottom: 2px solid #00BFFF;
  padding-bottom: 10px;
  text-align: center;
}

.detalles-ticket {
  margin-top: 20px;
}

.detalle {
  margin: 10px 0;
  font-size: 18px;
}

.etiqueta {
  font-weight: bold;
  color: #7f8c8d;
}
.infoS {
background-color: #ffffff6e; /* Color de fondo oscuro */
color: #000000; /* Texto en blanco */
font-size: 1.2em; /* Aumentar tamaño de fuente */
padding: 10px; /* Relleno en todos los lados */
border-radius: 5px; /* Bordes redondeados */
margin: 10px 0; /* Margen superior e inferior */
border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
text-align: center;
}
    </style>
    </head>
    <body>
      
    <div class="Bloque1">
    <div class="bloque-ticket">
        <h1 class="titulo-principal">Ticket ${ticket1} - Finalizo </h1>
        <div class="detalles-ticket">
            <div class="detalle"> <span class="etiqueta">Ticket:</span> ${ticket1}</div>
            <div class="detalle"> <span class="etiqueta">Usuario:</span> ${resulttiket[0].nomape}</div>
            <div class="detalle"> <span class="etiqueta">Correo:</span> ${resulttiket[0].correo}</div>
            <div class="detalle"> <span class="etiqueta">Empresa:</span> ${resulttiket[0].empresa}</div>
            <div class="detalle"> <span class="etiqueta">Estado:</span> ${resulttiket[0].estado}</div>
            <div class="detalle"> <span class="etiqueta">Fecha:</span> ${resulttiket[0].Fecha}</div>
            <div class="detalle"> <span class="etiqueta">Asunto:</span> ${resulttiket[0].asunto}</div>
        </div>
    </div>

    <h1 class="TituloHilo"> Detalles del Ticket </h1>
  
    <p class="InfoHilo">
    ${resulttiket[0].descripcion} </p>
    
    ${parrafosSoporte(resulttiket[0].nota)}

    

    <h1 class="infoTitulo"> Stock Utilizado </h1>

    
    ${infostock} 
  
  
      
    <div class="pieDePagina">  
      <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
  
    </div>
  
      </div>
  
    
    </body>
  </html>
    `
  
    let AsuntoCoreo = "Ticket " + ticket1 + " Finalizo.";
  
  sendEmail(AsuntoCoreo, ContenidoCorre , resulttiket[0].correo )






   }

    const sql555=`SELECT * FROM intervia WHERE  empresa = '${resulttiket[0].empresa}'`
    conector.query(sql555, function(err,resultjefes,filed) { 
      for(i=0; i< resultjefes.length; i++ ){
     let arr = resultjefes[i].valid5.split("");

    if ( select == "Finalizado" && arr[7] == "1" && resultjefes[i].valid3 == "1" && resultjefes[i].valid4 == "0" ){

      

    console.log("Finalizado" + ticket1)

    let ContenidoCorre = `
    <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
    *{
      font-family: 'Poppins', sans-serif;
    }
    body {
      background: rgba(252, 252, 255, 0);
  
    }
.Bloque1 {
  border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
    
    .Bienvenido {
      width: 100%;
      text-align: center;
       font-size: 18px;
      color: rgb(127, 87, 157);
    }
    .Registrarme {
      width: 50%;
      margin-left: 25%;
      text-align: center;
      display: block;
      text-decoration: none;
      color: black;
      border-bottom: solid 4px #8fdff3 ;
      border-bottom-width: 10%;
      font-size: 15px;
      text-decoration: none;
    }

    .infoTitulo {
      color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
    }

    .info {
      color: #000000;
      padding-left: 20%;
      padding-right: 20%;
      margin-top: 10%;
      padding-bottom: 10%;
      text-align: center;
      font-size: 20px;
    }


    
    .infoS {
      color: #000000;
  padding-left: 20%;
  padding-right: 20%;
  margin-top: 1%;
  padding-bottom: 0%;
  text-align: center;
  font-size: 20px;
    }


    .Bloque2 {
      background: rgba(163, 163, 163, 0.416);
      border-radius: 4px;
    }

.pieDePagina {

  background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
  width: 80%;
  height: 20%;
  border-radius: 4px;
  margin-left: 10%;
}

.pieDePagina img {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 5%; 
}


.TituloHilo {
  background-color: #333; /* Color de fondo oscuro */
  color: #fff; /* Texto en blanco */
  font-size: 1.2em; /* Aumentar tamaño de fuente */
  padding: 10px; /* Relleno en todos los lados */
  border-radius: 5px; /* Bordes redondeados */
  margin: 10px 0; /* Margen superior e inferior */
  border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
  text-align: center;
}

.InfoHilo {
  text-align: center;
  background-color: #f9f9f9; /* Color de fondo claro */
  color: #333; /* Texto oscuro */
  padding: 8px; /* Relleno en todos los lados */
  border-radius: 5px; /* Bordes redondeados */
  margin-top: 5px; /* Margen superior */
}

.bloque-ticket {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 20px auto;
  background-color: #f9f9f9;
}

.titulo-principal {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
  border-bottom: 2px solid #00BFFF;
  padding-bottom: 10px;
  text-align: center;
}

.detalles-ticket {
  margin-top: 20px;
}

.detalle {
  margin: 10px 0;
  font-size: 18px;
}

.etiqueta {
  font-weight: bold;
  color: #7f8c8d;
}
.infoS {
background-color: #ffffff6e; /* Color de fondo oscuro */
color: #000000; /* Texto en blanco */
font-size: 1.2em; /* Aumentar tamaño de fuente */
padding: 10px; /* Relleno en todos los lados */
border-radius: 5px; /* Bordes redondeados */
margin: 10px 0; /* Margen superior e inferior */
border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
text-align: center;
}
    </style>
    </head>
    <body>
      
    <div class="Bloque1">
    <div class="bloque-ticket">
        <h1 class="titulo-principal">Ticket ${ticket1} - Finalizo </h1>
        <div class="detalles-ticket">
            <div class="detalle"> <span class="etiqueta">Ticket:</span> ${ticket1}</div>
            <div class="detalle"> <span class="etiqueta">Usuario:</span> ${resulttiket[0].nomape}</div>
            <div class="detalle"> <span class="etiqueta">Correo:</span> ${resulttiket[0].correo}</div>
            <div class="detalle"> <span class="etiqueta">Empresa:</span> ${resulttiket[0].empresa}</div>
            <div class="detalle"> <span class="etiqueta">Estado:</span> ${resulttiket[0].estado}</div>
            <div class="detalle"> <span class="etiqueta">Fecha:</span> ${resulttiket[0].Fecha}</div>
            <div class="detalle"> <span class="etiqueta">Asunto:</span> ${resulttiket[0].asunto}</div>
        </div>
    </div>

    <h1 class="TituloHilo"> Detalles del Ticket </h1>
  
    <p class="InfoHilo">
    ${resulttiket[0].descripcion} </p>
    
    ${parrafosSoporte(resulttiket[0].nota)}

    

    <h1 class="infoTitulo"> Stock Utilizado </h1>

    
    ${infostock} 
  
  
      
    <div class="pieDePagina">  
      <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
  
    </div>
  
      </div>
  
    
    </body>
  </html>
    `
  
    let AsuntoCoreo = "Ticket " + ticket1 + " Finalizo.";
  
  sendEmail(AsuntoCoreo, ContenidoCorre , resultjefes[i].correo )







    } } })




const admins=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(admins, function(err,resultadmins,filed) { 
for(i=0; i< resultadmins.length; i++ ){
let arr = resultadmins[i].valid5.split("");

if ( select == "Finalizado" && arr[8] == "1" ) {



console.log("Finalizado" + ticket1)

let ContenidoCorre = `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
*{
  font-family: 'Poppins', sans-serif;
}
body {
  background: rgba(252, 252, 255, 0);

}
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}

.Bienvenido {
  width: 100%;
  text-align: center;
   font-size: 18px;
  color: rgb(127, 87, 157);
}
.Registrarme {
  width: 50%;
  margin-left: 25%;
  text-align: center;
  display: block;
  text-decoration: none;
  color: black;
  border-bottom: solid 4px #8fdff3 ;
  border-bottom-width: 10%;
  font-size: 15px;
  text-decoration: none;
}

.infoTitulo {
  color: #413f3fe6;
margin: 2px;
border: 0px;
font-size: 15px;
text-align: center;
border-radius: 5px;
}

.info {
  color: #000000;
  padding-left: 20%;
  padding-right: 20%;
  margin-top: 10%;
  padding-bottom: 10%;
  text-align: center;
  font-size: 20px;
}



.infoS {
  color: #000000;
padding-left: 20%;
padding-right: 20%;
margin-top: 1%;
padding-bottom: 0%;
text-align: center;
font-size: 20px;
}


.Bloque2 {
  background: rgba(163, 163, 163, 0.416);
  border-radius: 4px;
}

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%; 
}


.TituloHilo {
background-color: #333; /* Color de fondo oscuro */
color: #fff; /* Texto en blanco */
font-size: 1.2em; /* Aumentar tamaño de fuente */
padding: 10px; /* Relleno en todos los lados */
border-radius: 5px; /* Bordes redondeados */
margin: 10px 0; /* Margen superior e inferior */
border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
text-align: center;
}

.InfoHilo {
text-align: center;
background-color: #f9f9f9; /* Color de fondo claro */
color: #333; /* Texto oscuro */
padding: 8px; /* Relleno en todos los lados */
border-radius: 5px; /* Bordes redondeados */
margin-top: 5px; /* Margen superior */
}

.bloque-ticket {
border: 1px solid #e0e0e0;
padding: 20px;
border-radius: 10px;
max-width: 600px;
margin: 20px auto;
background-color: #f9f9f9;
}

.titulo-principal {
color: #2c3e50;
font-size: 18px;
margin-bottom: 20px;
border-bottom: 2px solid #00BFFF;
padding-bottom: 10px;
text-align: center;
}

.detalles-ticket {
margin-top: 20px;
}

.detalle {
margin: 10px 0;
font-size: 18px;
}

.etiqueta {
font-weight: bold;
color: #7f8c8d;
}
.infoS {
background-color: #ffffff6e; /* Color de fondo oscuro */
color: #000000; /* Texto en blanco */
font-size: 1.2em; /* Aumentar tamaño de fuente */
padding: 10px; /* Relleno en todos los lados */
border-radius: 5px; /* Bordes redondeados */
margin: 10px 0; /* Margen superior e inferior */
border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
text-align: center;
}
</style>
</head>
<body>
  
<div class="Bloque1">
<div class="bloque-ticket">
    <h1 class="titulo-principal">Ticket ${ticket1} - Finalizo </h1>
    <div class="detalles-ticket">
        <div class="detalle"> <span class="etiqueta">Ticket:</span> ${ticket1}</div>
        <div class="detalle"> <span class="etiqueta">Usuario:</span> ${resulttiket[0].nomape}</div>
        <div class="detalle"> <span class="etiqueta">Correo:</span> ${resulttiket[0].correo}</div>
        <div class="detalle"> <span class="etiqueta">Empresa:</span> ${resulttiket[0].empresa}</div>
        <div class="detalle"> <span class="etiqueta">Estado:</span> ${resulttiket[0].estado}</div>
        <div class="detalle"> <span class="etiqueta">Fecha:</span> ${resulttiket[0].Fecha}</div>
        <div class="detalle"> <span class="etiqueta">Asunto:</span> ${resulttiket[0].asunto}</div>
    </div>
</div>

<h1 class="TituloHilo"> Detalles del Ticket </h1>

<p class="InfoHilo">
${resulttiket[0].descripcion} </p>

${parrafosSoporte(resulttiket[0].nota)}



<h1 class="infoTitulo"> Stock Utilizado </h1>


${infostock} 


  
<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>
`

let AsuntoCoreo = "Ticket " + ticket1 + " Finalizo.";

sendEmail(AsuntoCoreo, ContenidoCorre , resultadmins[i].correo )




}}

})
})}) 




const ssql=`SELECT * FROM tikets WHERE  ntiket = '${ticket1}'`
conector.query(ssql, function(err,resulttiket,filed) {

const ssql55=`SELECT * FROM intervia WHERE  correo = '${resulttiket[0].correo}'`
conector.query(ssql55, function(err,result10,filed) { 
let arr = result10[0].valid5.split("");


if ( select == "Aguardando" && arr[9] == "1" ) {

console.log("Correo enviado a el usuario") }

const ssql555=`SELECT * FROM intervia WHERE  empresa = '${resulttiket[0].empresa}'`
conector.query(ssql555, function(err,resultjefes,filed) { 
for(i=0; i< resultjefes.length; i++ ){
let arr = resultjefes[i].valid5.split("");

if ( select == "Aguardando" && arr[10] == "1" && resultjefes[i].valid3 == "1" ){

       console.log("Correo para jefes de la empresa")

} } })


}) 

const adminss=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(adminss, function(err,resultadmins,filed) { 
for(i=0; i< resultadmins.length; i++ ){
let arr = resultadmins[i].valid5.split("");

if ( select == "Aguardando" && arr[11] == "1" ) {

console.log("Correo al ususario administrador")

}}

})

      
const adminssfac=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(adminssfac, function(err,resultadmins1,filed) { 

for(i=0; i< resultadmins1.length; i++ ){
let arr = resultadmins1[i].valid5.split("");

if ( facturar == true && arr[12] == "1" ) {

  CorreoObjetivo = resultadmins1[i].correo;
  console.log(CorreoObjetivo)

  AsuntoCoreo = "El ticket:" + ticket1 + " esta listo para Facturar"   ; 

console.log("Correo al ususario administrador para facturar")





  let ContenidoCorre = `
  <html>
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
      <meta charset="utf-8">
      <style>
        *{
          font-family: 'Poppins', sans-serif;
        }
        body {
          background: rgba(252, 252, 255, 0);
      
        }
    .Bloque1 {
      border: solid rgb(61, 208, 203) 3px;
    padding: 35px;
    width: 50%;
    margin-left: 25%;
    background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
    background-size: cover;
    margin-top: 5%;
    border-radius: 5px;
    }
        
        .Bienvenido {
          width: 100%;
          text-align: center;
           font-size: 18px;
          color: rgb(127, 87, 157);
        }
        .Registrarme {
          width: 50%;
          margin-left: 25%;
          text-align: center;
          display: block;
          text-decoration: none;
          color: black;
          border-bottom: solid 4px #8fdff3 ;
          border-bottom-width: 10%;
          font-size: 15px;
          text-decoration: none;
        }
    
        .infoTitulo {
          color: #413f3fe6;
    margin: 2px;
    border: 0px;
    font-size: 15px;
    text-align: center;
    border-radius: 5px;
        }
    
        .info {
          color: #000000;
          padding-left: 20%;
          padding-right: 20%;
          margin-top: 10%;
          padding-bottom: 10%;
          text-align: center;
          font-size: 20px;
        }
    
    
        
        .infoS {
          color: #000000;
      padding-left: 20%;
      padding-right: 20%;
      margin-top: 1%;
      padding-bottom: 0%;
      text-align: center;
      font-size: 20px;
        }
    
    
        .Bloque2 {
          background: rgba(163, 163, 163, 0.416);
          border-radius: 4px;
        }
    
    .pieDePagina {
    
      background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
      width: 80%;
      height: 20%;
      border-radius: 4px;
      margin-left: 10%;
    }
    
    .pieDePagina img {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 5%; 
    }
  
  
    .TituloHilo {
      background-color: #333; /* Color de fondo oscuro */
      color: #fff; /* Texto en blanco */
      font-size: 1.2em; /* Aumentar tamaño de fuente */
      padding: 10px; /* Relleno en todos los lados */
      border-radius: 5px; /* Bordes redondeados */
      margin: 10px 0; /* Margen superior e inferior */
      border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
      text-align: center;
  }
  
  .InfoHilo {
      text-align: center;
      background-color: #f9f9f9; /* Color de fondo claro */
      color: #333; /* Texto oscuro */
      padding: 8px; /* Relleno en todos los lados */
      border-radius: 5px; /* Bordes redondeados */
      margin-top: 5px; /* Margen superior */
  }
  
  .bloque-ticket {
      border: 1px solid #e0e0e0;
      padding: 20px;
      border-radius: 10px;
      max-width: 600px;
      margin: 20px auto;
      background-color: #f9f9f9;
  }
  
  .titulo-principal {
      color: #2c3e50;
      font-size: 18px;
      margin-bottom: 20px;
      border-bottom: 2px solid #00BFFF;
      padding-bottom: 10px;
      text-align: center;
  }
  
  .detalles-ticket {
      margin-top: 20px;
  }
  
  .detalle {
      margin: 10px 0;
      font-size: 18px;
  }
  
  .etiqueta {
      font-weight: bold;
      color: #7f8c8d;
  }
  .infoS {
    background-color: #ffffff6e; /* Color de fondo oscuro */
    color: #000000; /* Texto en blanco */
    font-size: 1.2em; /* Aumentar tamaño de fuente */
    padding: 10px; /* Relleno en todos los lados */
    border-radius: 5px; /* Bordes redondeados */
    margin: 10px 0; /* Margen superior e inferior */
    border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
    text-align: center;
  }
  
  
    
    
      </style>
      </head>
      <body>
        
        <div class="Bloque1">
          <div class="bloque-ticket">
              <h1 class="titulo-principal">Ticket ${ticket1} - Listo para facturar</h1>
              <div class="detalles-ticket">
                  <div class="detalle"> <span class="etiqueta">Ticket:</span> ${ticket1}</div>
                  <div class="detalle"> <span class="etiqueta">Usuario:</span> ${resulttiket[0].nomape}</div>
                  <div class="detalle"> <span class="etiqueta">Correo:</span> ${resulttiket[0].correo}</div>
                  <div class="detalle"> <span class="etiqueta">Empresa:</span> ${resulttiket[0].empresa}</div>
                  <div class="detalle"> <span class="etiqueta">Estado:</span> ${resulttiket[0].estado}</div>
                  <div class="detalle"> <span class="etiqueta">Fecha:</span> ${resulttiket[0].Fecha}</div>
                  <div class="detalle"> <span class="etiqueta">Asunto:</span> ${resulttiket[0].asunto}</div>
              </div>
          </div>
          
  
        
          <h1 class="TituloHilo"> Detalles del Ticket </h1>
    
           <p class="InfoHilo">
           ${resulttiket[0].descripcion} </p>
           
           ${parrafosSoporte(resulttiket[0].nota)}
  
   
           ${ renderInfo(resulttiket[0].facturacion2)} 
           
    
           <h1 class="infoTitulo"> Stock Utilizado </h1>
    
           
           ${infostock} 
         
    
    
    
    
    
      <div class="pieDePagina">  
        <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
    
      </div>
    
        </div>
    
      
      </body>
    </html>
  `

sendEmail(AsuntoCoreo, ContenidoCorre ,CorreoObjetivo )


}}




})



  


})
   }
  
   
  
  
   if (req.body.presupuetar == true) {  console.log("Listo para presupuestar") }
   
  
  
  }    )



  
   







          
          
        



///// Modificar la empresa del usuario


app.post('/modempresa',  function(req,res){ 


let correo  =  req.body.correo;
let empresa  =  req.body.dominio;
console.log(correo + empresa)


const sql= `UPDATE intervia set empresa='${empresa}' WHERE correo='${correo}'`
conector.query(sql, function(err,result,filed) {
  if (err) throw err
  console.log("echo");
 res.send(true)
   })  


})


// INGRESAR UN NUEVO USUARIO

app.get('/usersin',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1) {

  res.sendFile(path.resolve(__dirname,"tikets" , "usersin.html"));
  
  console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})




// INICIAR UN TICKET DESDE EL PANEL DE CONTROL 

app.get('/usermanual',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1) {

  res.sendFile(path.resolve(__dirname,"tikets" , "usermanual.html"));
  
  console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})


///// MODIFICAR LA CONTRASEÑA 

app.get('/pssmod',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1) {

  res.sendFile(path.resolve(__dirname,"tikets" ,"pssmod.html"));
  
  console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})


app.post('/newpssad',  function(req,res){ 


let correo  =  req.body.correo;
let nuevaContraseña  =  req.body.nuevaContraseña;


const sql= `UPDATE intervia set pass='${nuevaContraseña}' WHERE correo='${correo}'`
conector.query(sql, function(err,result,filed) {
  if (err) throw err
  console.log("echo");
 res.send(true)
   })  

   


})

//// FILTRO DE TIKETS

app.get('/filtrotikets',  function(req,res){ 



  if(req.session.online == true && req.session.valid4 == 1 ) {

      res.sendFile(path.resolve(__dirname,"tikets" , "filtrotikets.html"));
      
 

  }   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                  console.log("solicitud recivida")   }


})

app.post('/historialfiltro',  function(req,res){  

console.log(req.body.empresa)


const sql3=`SELECT * FROM tikets WHERE  estado = '${req.body.empresa}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})


app.post('/buscadortiket',  function(req,res){  

console.log(req.body.tiket)


const sql3=`SELECT * FROM tikets WHERE  ntiket = '${req.body.tiket}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})


app.post('/descargaimg',  function(req,res){  
const imageName = req.body.imagen;
console.log(imageName)
console.log("ejecutando descarga")
const imagePath = path.join(__dirname, `uploads/${imageName}`);
res.setHeader('Content-Disposition', 'attachment; filename='+imageName);
res.sendFile(imagePath);
});



///VALIDAR CON LINK DE EMAIL



app.get('/UserValid/:id', (req, res) => {


const codigov = req.params.id;
const sql=`SELECT * FROM intervia WHERE codigov = '${codigov}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err
let resultado = result[0];
if (resultado == undefined) { res.send(false) } 
else if  (result[0].codigov == codigov) { 
  const sql2= `UPDATE intervia set valid2= "1" WHERE codigov='${result[0].codigov}'`
  conector.query(sql2, function(err,result,filed) {
      if (err) throw err
      console.log(result[0])});  res.sendFile(path.resolve(__dirname, "public" , "acept.html"))  } 

})


});


/// HACER PUBLICO UN TICKET



app.get('/p/:tck',  function(req,res){ 

res.sendFile(path.resolve(__dirname,"public" ,"historialp.html"),)



})

/// Solicitud de ticket si este es publico

app.post('/publicticket',  function(req,res){  

console.log("Ejecutando")

const tck = req.body.tck;

const sql3=`SELECT * FROM tikets WHERE  ntiket = '${tck}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err;
if (!result2.length) {
  console.log("No se encontraron resultados");
  res.send(false)
} else {
  console.log(result2);
  if (result2[0].tiempo == null) {  res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"))}
  else if (result2[0].tiempo == "true") { res.send(result2[0])}
}
});
})  



app.post('/tckpub',  function(req,res){


const tck = req.body.tiket;
console.log(tck)


const sql3=`SELECT * FROM tikets WHERE  ntiket = '${tck}' `
conector.query(sql3, function(err,result2,filed) {
  if (err) throw err;
  if (!result2.length) {
    console.log("No se encontraron resultados");
  } else {
    console.log(result2[0].tiempo); 
    if (result2[0].tiempo === "null") { 
      const sql4=`UPDATE tikets set tiempo= "true" WHERE ntiket='${tck}'`
      conector.query(sql4, function(err,result2,filed) {
        if (err) throw err
        console.log("modificado"); 
        res.send(true)
      });
    } else if (result2[0].tiempo === "true") { 
      console.log("ya es publico");
      res.send(true)
    } 
  }
});})


/// ME PERMITE SABER LOS USUARIOS QUE EXISTEN Y ENVIARLOS

app.post('/MetodoUser',  function(req,res){  

  const sql3=`SELECT * FROM intervia `
  conector.query(sql3, function(err,result2,filed) {
  if (err) throw err
  console.log(result2); 

  const resultado = result2.filter(result2 => result2.hasOwnProperty("correo"));



})


} ) 

////////////////////////// FACTURACION 

app.get('/facturacion',  function(req,res){ 

console.log("t x empresa")

  if(req.session.online == true && req.session.valid4 == 1 ) {

      res.sendFile(path.resolve(__dirname,"tikets" , "facturacion.html"));
      
 

  }   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                  console.log("solicitud recivida")   }


})

/////////////// HISTORIAL PUBLICO

app.post('/historialp',  function(req,res){  

console.log(req.body.empresa)


const sql3=`SELECT * FROM tikets WHERE  empresa = '${req.body.empresa}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})


app.post('/pendientesfactu',  function(req,res){  

const sql3=`SELECT * FROM tikets WHERE  facturacion1 = '${"true"}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})

app.post('/listosfactu',  function(req,res){  

const sql3=`SELECT * FROM tikets WHERE  facturacion1 = '${"false"}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2); 
res.send(result2)  })

})


app.post('/upfactu',  function(req,res){  

req.body.tiket

const sql2= `UPDATE tikets set facturacion1= "false" WHERE ntiket='${req.body.tiket}'`
conector.query(sql2, function(err,result,filed) {
    if (err) throw err
    console.log(result[0])}); 
     res.send(true)

})



app.get('/newuseradmin/:id', (req, res) =>{ 

res.sendFile(path.resolve(__dirname,"tikets" ,"newuseradmin.html"),)
          
          })


/////////////////// BANEAR POR IP A USUARIOS QUE REPITAN DEMACIADAS VECES LA CONTRASEÑA ETA INFORMACION ESTA PASADA POR PARAMETRO DE INICIO DE SESSION

function Baneosip(IPAnalisada,correo,valorCorrecto) {

if(valorCorrecto == "1"){ 

  const sql=`SELECT * FROM baneos WHERE ip = '${IPAnalisada}'`
  conector.query(sql, function(err,result,filed) {
 if (err) throw err
 if (result[0]== undefined){

  const sql2=`INSERT INTO baneos (ip, correoAsociado , intentos ) VALUES ('${IPAnalisada}','${correo}' , '${"1"}')`
  conector.query(sql2, function(err,result2,filed) {
      if(err) throw err  })  } else {

          const sql= `UPDATE baneos set intentos='${"0"}' WHERE ip= '${IPAnalisada}'` 
          conector.query(sql, function(err,result,filed) {
          if (err) throw err   }) } }) } else {
const sql=`SELECT * FROM baneos WHERE ip = '${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err
if (result[0]== undefined){

const sql2=`INSERT INTO baneos (ip, correoAsociado , intentos ) VALUES ('${IPAnalisada}','${correo}' , '${"1"}')`
conector.query(sql2, function(err,result,filed) {
    if(err) throw err
    console.log(result)
})


}  else if (result[0].intentos == "0" ) { const sql= `UPDATE baneos set intentos= '${"1"}', correoAsociado='${correo}' WHERE ip='${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })


}


else if (result[0].intentos == "1" ) { const sql= `UPDATE baneos set intentos= '${"2"}',correoAsociado='${correo}' WHERE ip='${IPAnalisada}'`
        conector.query(sql, function(err,result,filed) {
         if (err) throw err   })


}  else if (result[0].intentos == "2" ) { const sql= `UPDATE baneos set intentos= '${"3"}', correoAsociado='${correo}' WHERE ip='${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })


} else if (result[0].intentos == "3" ) { const sql= `UPDATE baneos set intentos= '${"4"}' , correoAsociado='${correo}' WHERE ip='${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })


} else if (result[0].intentos == "4" ) { const sql= `UPDATE baneos set intentos= '${"5"}', correoAsociado='${correo}' WHERE ip='${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })
console.log("Baneado por IP")


}



})


} }

///////////////////// 

app.get('/baneados',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1) {

    res.sendFile(path.resolve(__dirname,"tikets" ,"baneados.html"));
    
    console.log("solicitud recivida")

}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})


app.post('/listipbaneadas',  function(req,res){

const sql=`SELECT * FROM baneos WHERE intentos = '${"5"}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err
if (result[0]== undefined){ res.send(false)

} else res.send(result)})})

app.post('/listipconectadas',  function(req,res){

const sql=`SELECT * FROM baneos `
conector.query(sql, function(err,result,filed) {
if (err) throw err
if (result[0]== undefined){ res.send(false)

} else res.send(result)})})



app.post('/desbaneo',  function(req,res){


let IPAnalisada = req.body.ip;

console.log(IPAnalisada)

const sql= `UPDATE baneos set intentos= '${"0"}' WHERE ip='${IPAnalisada}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })
console.log("Ip desbaneada")
res.send(true)

})




/////////// EDITOR GLOBAL para cambiar valores como nombre correo ETC

app.post('/editorglobal',  function(req,res){

console.log("ejecutando")


let viejoValor = req.body.nuevoValor;
let  nuevoValor  = req.body.viejoValor;
let protocolo = req.body.protocolo;
console.log(nuevoValor)
console.log(viejoValor)


if ( protocolo == "dominio" ){
const sql= `UPDATE empresa set dominio= '${viejoValor}' WHERE dominio='${nuevoValor}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err   })}

else if ( protocolo == "empresa"){
console.log("Cambio de nombre a una empresa")

const sql= `UPDATE empresa set empresa= '${viejoValor}' WHERE empresa='${nuevoValor}'`
 conector.query(sql, function(err,result,filed) {
  if (err) throw err   })
  
  const sql2= `UPDATE intervia set empresa= '${viejoValor}' WHERE empresa='${nuevoValor}'`
  conector.query(sql2, function(err,result1,filed) {
   if (err) throw err   }) }

else if ( protocolo == "correo"){

const sql= `UPDATE intervia set correo= '${viejoValor}' WHERE correo='${nuevoValor}'`
     conector.query(sql, function(err,result,filed) {
      if (err) throw err   })
      
      const sql2= `UPDATE tikets set correo= '${viejoValor}' WHERE correo='${nuevoValor}'`
      conector.query(sql2, function(err,result1,filed) {
       if (err) throw err   }) }


       else if ( protocolo == "nombre"){

        const sql= `UPDATE intervia set nombre= '${viejoValor}' WHERE correo='${nuevoValor}'`
               conector.query(sql, function(err,result,filed) {
                if (err) throw err   })
                
               }







})


/////////////////PANEL DE NOTIFICACIONES 

app.get('/notificaciones',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1 ) {

  res.sendFile(path.resolve(__dirname,"tikets" , "notificaciones.html"));
  


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
              console.log("solicitud recivida")   }


})




app.post('/notificaremplazos',  function(req,res){ 


let correo = req.body.correo;
let string = req.body.string;

const sql= `UPDATE intervia set valid5= '${string}' WHERE correo='${correo}'`
                conector.query(sql, function(err,result,filed) {
                 if (err) throw err   })

        


})


///////// Solicitar cambiod e contraseña


app.post('/notificaremplazos',  function(req,res){ 


let correo = req.body.correo;
let string = req.body.string;

const sql=`SELECT * FROM intervia WHERE correo = '${correo}'`
 conector.query(sql, function(err,result,filed) {
 if (err) throw err
 let resultado = result[0];

 

        


})
})


///////// Solicitar cambio de contraseña y actualizar informacion

app.post('/solictarcambiodepss',  function(req,res){ 


let correo = req.body.correo;
console.log(correo)


const sql=`SELECT * FROM intervia WHERE correo = '${correo}'`
 conector.query(sql, function(err,result,filed) {
 if (err) throw err

codigov = result[0].codigov;

console.log(result[0])


//CodigoHTML


let subject = 'Establecer contraseña Intervia No-Replay';
let text= `
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
<meta charset="utf-8">
<style>
  *{
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: rgb(44, 44, 45);

  }
.Bloque1 {
border: solid rgb(61, 208, 203) 3px;
padding: 35px;
width: 50%;
margin-left: 25%;
background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
background-size: cover;
margin-top: 5%;
border-radius: 5px;
}
  
  .Bienvenido {
    width: 100%;
    text-align: center;
    color: rgb(127, 87, 157);
  }
  .Registrarme {
    width: 50%;
    margin-left: 25%;
    text-align: center;
    display: block;
    text-decoration: none;
    color: black;
    border-bottom: solid 4px #8fdff3 ;
    border-bottom-width: 10%;
    font-size: 15px;
    text-decoration: none;
  }
  .info {
    color: #000000;
    padding-left: 20%;
    padding-right: 20%;
    margin-top: 10%;
    padding-bottom: 10%;
  }

.pieDePagina {

background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
width: 80%;
height: 20%;
border-radius: 4px;
margin-left: 10%;
}

.pieDePagina img {
height: 100%;
width: 100%;
box-sizing: border-box;
padding: 5%;
}


</style>
</head>
<body>
  
  <div class="Bloque1">
    <h1 class="Bienvenido">Establecer Contraseña </h1>

    <a class="Registrarme" href="https://www.soporte.intervia.com.ar/newuseradmin/${codigov}"> Click Aqui Para establecer contraseña. </a>

    <p class="info">A principios del año 2023 Intervia junto con Rh global comenzará a implementar un sistema de tickets para organizar mejor sus soportes.

      Este innovador sistema permite un control más personal sobre sus solicitudes o soportes, ya sea que estos tengan una duración más prolongada que una simple atención.
      
      Además, permite llevar una bitácora sobre los problemas más comunes de su equipo y ver si estos se repiten en'el tiempo para tomar otras decisiones.</p>

<div class="pieDePagina">  
  <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">

</div>

  </div>


</body>
</html>

 





`  

sendEmail(subject, text, correo )




 

        

res.send(true)
})
})


////////////// Buscador de usuarios

app.post('/buscadordeusuarios',  function(req,res){ 



const sql=`SELECT * FROM intervia `
 conector.query(sql, function(err,result,filed) {
 if (err) throw err


 function eliminarPropiedad() {

  return new Promise((resolve, reject) => {
    for (let i = 0; i < result.length; i++) {
      delete result[i].pass;
     
     
    }

    resolve(result);
  });
}



eliminarPropiedad().then(() => {

  resultadofinal(); 

});

function resultadofinal() {

res.send(result)
}


})
})



app.post('/reestablecernotificaciones',  function(req,res){ 


NuevoValor =  req.body.valor;


console.log(NuevoValor)

const sql = `UPDATE intervia SET valid5 = '${NuevoValor}'`; 
conector.query(sql, function (err, result) {
if (err) throw err;
console.log(result.affectedRows + " registros actualizados");
});

console.log("Nuevo valor establecido")

res.send(true)


})



app.post('/listausu2',  function(req,res){  

let  empresa = req.body.empresa.toLowerCase()

console.log(empresa)

const sql = `SELECT COUNT(*) AS cantidad_resultados FROM intervia WHERE empresa = '${empresa}'`;
conector.query(sql, function(err,result2,filed) {
if (err) throw err
console.log(result2);
res.json(result2[0].cantidad_resultados) 



})


} ) 
///////////////// CODIGO QR

app.get('/TicketQR/:id', (req, res) => {

const codigov = req.params.id;
console.log(codigov)
const sql=`SELECT * FROM intervia WHERE codigov = '${codigov}'`
conector.query(sql, function(err,result,filed) {
if (err) throw err
let resultado = result[0];
console.log(resultado)
 if (resultado == undefined) { res.send(false) } 
 else { 
  res.sendFile(path.resolve(__dirname, "tikets" , "QR.html"))  } 

})




});



////////////// Validar el codigo para generar el QR 

app.post('/codigovQR',  function(req,res){

var codigo = req.body.codigo;


const admins=`SELECT * FROM intervia WHERE codigov = '${codigo}'`
conector.query(admins, function(err,resultado,filed) { 

 console.log(resultado[0].nombre) 

 res.send({
  'nombre':resultado[0].nombre,
})

})




})


///////////////

function presupuestar(ticket) {



const sql5=`SELECT * FROM tikets WHERE  ntiket = '${ticket}'`
conector.query(sql5, function(err,resulttiket,filed) { 


  



  let ContenidoCorre = `
  <html>
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
      <meta charset="utf-8">
      <style>
        *{
          font-family: 'Poppins', sans-serif;
        }
        body {
          background: rgba(252, 252, 255, 0);
      
        }
    .Bloque1 {
      border: solid rgb(61, 208, 203) 3px;
    padding: 35px;
    width: 50%;
    margin-left: 25%;
    background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
    background-size: cover;
    margin-top: 5%;
    border-radius: 5px;
    }
        
        .Bienvenido {
          width: 100%;
          text-align: center;
           font-size: 18px;
          color: rgb(127, 87, 157);
        }
        .Registrarme {
          width: 50%;
          margin-left: 25%;
          text-align: center;
          display: block;
          text-decoration: none;
          color: black;
          border-bottom: solid 4px #8fdff3 ;
          border-bottom-width: 10%;
          font-size: 15px;
          text-decoration: none;
        }
    
        .infoTitulo {
          color: #413f3fe6;
    margin: 2px;
    border: 0px;
    font-size: 15px;
    text-align: center;
    border-radius: 5px;
        }
    
        .info {
          color: #000000;
          padding-left: 20%;
          padding-right: 20%;
          margin-top: 10%;
          padding-bottom: 10%;
          text-align: center;
          font-size: 20px;
        }
    
    
        
        .infoS {
          color: #000000;
      padding-left: 20%;
      padding-right: 20%;
      margin-top: 1%;
      padding-bottom: 0%;
      text-align: center;
      font-size: 20px;
        }
    
    
        .Bloque2 {
          background: rgba(163, 163, 163, 0.416);
          border-radius: 4px;
        }
    
    .pieDePagina {
    
      background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
      width: 80%;
      height: 20%;
      border-radius: 4px;
      margin-left: 10%;
    }
    
    .pieDePagina img {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 5%; 
    }
  
  
    .TituloHilo {
      background-color: #333; /* Color de fondo oscuro */
      color: #fff; /* Texto en blanco */
      font-size: 1.2em; /* Aumentar tamaño de fuente */
      padding: 10px; /* Relleno en todos los lados */
      border-radius: 5px; /* Bordes redondeados */
      margin: 10px 0; /* Margen superior e inferior */
      border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
      text-align: center;
  }
  
  .InfoHilo {
      text-align: center;
      background-color: #f9f9f9; /* Color de fondo claro */
      color: #333; /* Texto oscuro */
      padding: 8px; /* Relleno en todos los lados */
      border-radius: 5px; /* Bordes redondeados */
      margin-top: 5px; /* Margen superior */
  }
  
  .bloque-ticket {
      border: 1px solid #e0e0e0;
      padding: 20px;
      border-radius: 10px;
      max-width: 600px;
      margin: 20px auto;
      background-color: #f9f9f9;
  }
  
  .titulo-principal {
      color: #2c3e50;
      font-size: 18px;
      margin-bottom: 20px;
      border-bottom: 2px solid #00BFFF;
      padding-bottom: 10px;
      text-align: center;
  }
  
  .detalles-ticket {
      margin-top: 20px;
  }
  
  .detalle {
      margin: 10px 0;
      font-size: 18px;
  }
  
  .etiqueta {
      font-weight: bold;
      color: #7f8c8d;
  }
  .infoS {
    background-color: #ffffff6e; /* Color de fondo oscuro */
    color: #000000; /* Texto en blanco */
    font-size: 1.2em; /* Aumentar tamaño de fuente */
    padding: 10px; /* Relleno en todos los lados */
    border-radius: 5px; /* Bordes redondeados */
    margin: 10px 0; /* Margen superior e inferior */
    border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
    text-align: center;
  }
  
  
    
    
      </style>
      </head>
      <body>
        
        <div class="Bloque1">
          <div class="bloque-ticket">
              <h1 class="titulo-principal">Ticket ${resulttiket[0].ntiket} - Fue enviado a presupuestar </h1>
              <div class="detalles-ticket">
                  <div class="detalle"> <span class="etiqueta">Ticket:</span> ${resulttiket[0].ntiket}</div>
                  <div class="detalle"> <span class="etiqueta">Usuario:</span> ${resulttiket[0].nomape}</div>
                  <div class="detalle"> <span class="etiqueta">Correo:</span> ${resulttiket[0].correo}</div>
                  <div class="detalle"> <span class="etiqueta">Empresa:</span> ${resulttiket[0].empresa}</div>
                  <div class="detalle"> <span class="etiqueta">Estado:</span> ${resulttiket[0].estado}</div>
                  <div class="detalle"> <span class="etiqueta">Fecha:</span> ${resulttiket[0].Fecha}</div>
                  <div class="detalle"> <span class="etiqueta">Asunto:</span> ${resulttiket[0].asunto}</div>
              </div>
          </div>
          
  
        
          <h1 class="TituloHilo"> Detalles del Ticket </h1>
    
           <p class="InfoHilo">
           ${resulttiket[0].descripcion} </p>
           
           ${parrafosSoporte(resulttiket[0].nota)}
  
   
           ${ renderInfo(resulttiket[0].facturacion2)} 
           
    
           <h1 class="infoTitulo"> Stock Utilizado </h1>
    
           
           ${infostock} 
         
    
    
    
    
    
      <div class="pieDePagina">  
        <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
    
      </div>
    
        </div>
    
      
      </body>
    </html>
  
  `

  let AsuntoCoreo = "Presupuestar Ticket : " + ticket;


  const adminssfac=`SELECT * FROM intervia WHERE  valid4 = '1'`
conector.query(adminssfac, function(err,resultadmins1,filed) { 

for(i=0; i< resultadmins1.length; i++ ){
let arr = resultadmins1[i].valid5.split("");

if (  arr[12] == "1" ) {



sendEmail(AsuntoCoreo, ContenidoCorre , resultadmins1[i].correo ) }}})

} )




}


function renderInfo(variable) {

  console.log(variable)
  
  // Si la variable es null o no tiene valor
  if (variable === null || variable === 'null') {
      return '';
  }

  // Si la variable tiene valor
  return `
     <h1 class="TituloHilo"> Detalles de Internos </h1>
     <p class="InfoHilo"> ${variable} </p>
  `;
}







////////////////////////////// REACT ////////////////////////////////////////////



//// STOCK

app.post('/stock', (req, res) => {


  const obtenerFechaActual = () => {


    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Nota: los meses comienzan en 0 (enero)
    const año = fecha.getFullYear();
  
    return `${dia}/${mes}/${año}`;
  };


const objetoDatos = req.body;
codigo = generarCodigo(req.body.plantilla)
let categoria = req.body.plantilla;
let sn = req.body.serial;
let descripcion = req.body.descripcion;
let estado = req.body.estado;
let factura = req.body.factura;
const fechaActual = obtenerFechaActual();


const sql2=`INSERT INTO stock ( categoria , sn , descripcion , estado ,   factura ,  destino  , codigo , entregado , nota  ) VALUES ( '${categoria}', '${sn}', '${descripcion}' , '${estado}', '${factura}' , '${ "Stock"}',  '${codigo}' , '${"NO"}' , '${fechaActual}' )`
conector.query(sql2, function(err,result,filed) {
   if(err) throw err
   console.log(result)
})



res.send(true)

});


function generarCodigo(item) {
// Lista de asociaciones de ítems con sus valores
const asociaciones = {
  memoria: 'ME',
  camara: 'CA',
  teclado: 'TE',
  mouse: 'MO',
  complemento: 'CO',
  fuente: 'FU',
  placared: 'PR',
  disco: 'DS',
  mother: 'PM',
  cables: 'CL',
  gabinete: 'GA',
  red: 'RD',
  equipo: 'EQ',
  procesador: 'PO',
  gpu: 'GP',
  perifericos: 'PE',
  baterias: 'BA',
  pendrive: 'PN',
  tonercartucho: 'TC',
  ups: 'UP',
  monitor: 'MN',
  impresora: 'IM',
  licencia: "LI"
};

// Convertir el ítem a minúsculas para hacer la búsqueda en el objeto
const itemLowerCase = item.toLowerCase();

// Obtener el valor asociado al ítem
const valor = asociaciones[itemLowerCase] || 'PR Des';

// Generar un número aleatorio de 6 dígitos
const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

// Combinar el valor con el número aleatorio
const codigoGenerado = valor + '-' + numeroAleatorio;

return codigoGenerado;
}

/////////////// Lista Stock

app.post('/solicitudstock', (req, res) => {

console.log("Solcitud Stock")

const sql = `SELECT * FROM stock`;
conector.query(sql, function(err, result, fields) {
  if (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error en la consulta' });
  } else {
    if (result.length > 0) {
      console.log(result)
      res.json(result); // Enviar los datos obtenidos como respuesta en formato JSON
    } else {
      res.json([]); // Si no hay datos, enviar un array vacío como respuesta
    }
  }
});
});

//////////////// Eliminar Stock

app.post('/deletstock', (req, res) => { 


let codigo = req.body.stock;

const sql3=`DELETE FROM stock WHERE  codigo = '${codigo}' `
conector.query(sql3, function(err,result2,filed) {
if (err) throw err
console.log(result2);
res.send(true) }

) } ) 


/////////////////////////// Ruta a stock

app.get('/stock',  function(req,res){ 



if(req.session.online == true && req.session.valid4 == 1 ) {

    res.sendFile(path.resolve(__dirname,"public" , "stock" , "index.html"));
    


}   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                console.log("solicitud recivida")   }


})




app.get('/stock/:id', (req, res) => { 



 res.sendFile(path.resolve(__dirname,"tikets" ,"listastock.html"),)



})




app.post('/listaStock', (req, res) => {
  const sql = `SELECT * FROM stock WHERE entregado = '${"NO"}'`; 
  conector.query(sql, function(err, result, fields) {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      if (result.length > 0) {
        // Invertir el arreglo result
        const reversedResult = result.reverse();
        res.json(reversedResult); 
      } else {
        res.json([]); 
      }
    }
  });
});



app.post('/usostock', (req, res) => {


let ticket = req.body.ticket;
let codigo = req.body.codigo;


const sql5=`SELECT * FROM tikets WHERE  ntiket = '${ticket}'`
conector.query(sql5, function(err,resulttiket,filed) {

  const sql6=`SELECT * FROM stock WHERE  codigo = '${codigo}'`
  conector.query(sql6, function(err,resultstock,filed) {

    let destino = resulttiket[0].empresa ;

    const sql2 = `UPDATE stock SET entregado = '${ticket}', destino = '${destino}' WHERE codigo = '${codigo}'`;
      conector.query(sql2, function(err,result,filed) {
     if(err) throw err
   console.log(result)
})





   })





})





} )


////////////////////////////////////////////////////////////

/* const sql = `SELECT * FROM tikets `;
conector.query(sql, function(err, result, fields) {
  if (err) throw err;

  for (let i = 0; i < result.length; i++) {
    if (result[i].nota) {
      result[i].nota = result[i].nota.replace(/"/g, '');

      // Actualizar la base de datos con el nuevo valor de nota
      const updateSql = `UPDATE tikets SET nota = '${result[i].nota}' WHERE id = ${result[i].id}`;
      conector.query(updateSql, function(err, updateResult) {
        if (err) {
          console.error(`Error actualizando el registro ${result[i].id}: ${err}`);
        } else {
          console.log(`Registro ${result[i].id} actualizado correctamente`);
        }
      });
    }
  }

  // Puedes continuar con el resto de tu código aquí...   
});

*/



///////////////// Actualizacion del Hilo





function HilodeSoporte(nuevaInformacion, tiket, NombreHilo) {


  console.log(tiket)


  const sql = `SELECT * FROM tikets WHERE ntiket = '${tiket}'`;
  conector.query(sql, function(err, result, fields) {
    if (err) throw err;

    const ValorAnterior = result[0].nota; // Obtener el valor de la base de datos

    const now = new Date();

    // Obtener partes específicas de la fecha
    const dia = now.getDate().toString().padStart(2, '0');
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const anio = now.getFullYear();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');

    const fechaFormateada = ` Hilo : ${dia}-${mes}-${anio} ${horas}:${minutos} Actualizado por : ${NombreHilo}`;

    function filtrar() {
      if (ValorAnterior) {
        // Convertir ValorAnterior a un arreglo utilizando split
        const ValorAnteriorArray = ValorAnterior.split(',').map(item => item.trim());

        // Agregar nuevaInformacion al inicio del arreglo
        ValorAnteriorArray.unshift(nuevaInformacion);

        // Agregar fechaFormateada al inicio del arreglo
        ValorAnteriorArray.unshift(fechaFormateada);

        return ValorAnteriorArray;
      } else {
        return [fechaFormateada, nuevaInformacion];
      }
    }

    const nuevoValorJSON = filtrar();

    const nuevoValorString = nuevoValorJSON.join(', '); // Convertir el arreglo de nuevo a un string
    const sqlUpdate = `UPDATE tikets SET nota='${nuevoValorString}' WHERE ntiket='${tiket}'`;
    
    conector.query(sqlUpdate, function(err, result, filed) {
      if (err) throw err;
      console.log("Hecho");
    });
  });
}




function parrafosSoporte(data1) {
  if (data1 == null) { 
      return "<p class='info'> Sin detalles </p>"; 
  } else { 

      let data = data1.split(',').map(item => item.trim());

      var result = "";

      for (var i = 0; i < data.length; i++) {
          if (i % 2 === 0) { // Si i es un número par
              result += '<p class="TituloHilo">' + data[i] + "</p> ";
          } else { // Si i es un número impar
              result += '<p class="InfoHilo">' + data[i] + "</p> ";
          }
      }

      return result;
  }
}





app.post('/crearArchivo', (req, res) => {
empresaSolicitada = req.body.empresa
CrearArchivo(empresaSolicitada)

function CrearArchivo(empresa) {



const sql = `SELECT * FROM tikets WHERE empresa = '${empresa}'`;
conector.query(sql, function(err, result, fields) {  
  const filteredResult = result.map(item => {
    const {
      ntiket,
      empresa,
      nomape,
      correo,
      asunto,
      descripcion,
      Fecha,
      estado,
      nota,
    } = item;
  
    return {
      ntiket,
      empresa,
      nomape,
      correo,
      asunto,
      descripcion,
      Fecha,
      estado,
      nota,
    };
  });    
  
  const worksheet = XLSX.utils.json_to_sheet(filteredResult);

// Crear un libro de trabajo y agregar la hoja de cálculo
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

// Guardar el libro de trabajo en un archivo Excel
const excelFilePath = 'datos.xlsx'; // Nombre del archivo Excel
XLSX.writeFile(workbook, excelFilePath);

console.log(`Datos guardados en el archivo Excel: ${excelFilePath}`);



renombrar()

})  



function renombrar()
{
const workbook = XLSX.readFile('datos.xlsx');

// Definir el nuevo mapeo de títulos
const nuevoMapeo = {
'A': 'Numero de Ticket',
'B': 'Empresa',
'C': 'Nombre y Apellido',
'D': 'Correo',
'E': 'Asunto',
'F': 'Descripcion',
'H': 'Estado',
'I': 'Detalle del Soporte'
};

// Obtener la hoja de cálculo activa
const hoja = workbook.Sheets[workbook.SheetNames[0]];

// Modificar los títulos de las columnas
Object.keys(nuevoMapeo).forEach(columna => {
const celda = hoja[columna + '1'];
if (celda) {
  celda.v = nuevoMapeo[columna];
}
});

// Guardar los cambios en un nuevo archivo
const nuevoArchivo = 'Listo.xlsx';
XLSX.writeFile(workbook, nuevoArchivo);

console.log('Títulos modificados con éxito.');




}  }

res.send(true)

})



app.post('/dwticket', (req, res) => {


  const archivoExcelPath = 'Listo.xlsx';
res.download(archivoExcelPath, 'Listo.xlsx', (err) => {
if (err) {
  // Manejo de errores, si es necesario
  console.error('Error al descargar el archivo:', err);
  res.status(500).send('Ocurrió un error al descargar el archivo.');
} });
  //
  console.log('Han pasado 2 segundos. Acción ejecutada.'); 


})


















app.get('/puntuacion/:id',  function(req,res){ 



  if(req.session.online == true && req.session.valid4 == 1 ) {
  
    res.sendFile(path.resolve(__dirname,"tikets" ,"puntuacion.html"),);
    console.log("solicitud recibida")
      
  
  
  }   else {   res.sendFile(path.resolve(__dirname,"tikets" ,"noacces.html"),);
                  console.log("solicitud recibida")   }
  
  
  })
  



  app.post('/puntuacionfinal', (req, res) => {

   
      ticket = req.body.ticket;
      let puntuacion = req.body.puntuacion;
      let tiempo = req.body.tiempo;
      let clave1 = req.body.clave1Value;
      let clave2 = req.body.clave2Value; 
      let clave3 = req.body.clave3Value; 
      let clave = [clave1,clave2,clave3];
     

   

    const sql2= `UPDATE tikets set calificado= "true" WHERE ntiket='${ticket}'`
    conector.query(sql2, function(err,result,filed) {
        if (err) throw err } ) 

        const sql4 = `SELECT * FROM tikets WHERE ntiket = '${ticket}'`;
conector.query(sql4, function(err, result, fields) { 


      let fecha = result[0].Fecha;
      let facturado = result[0].facturacion1;
      console.log(result[0].nota)
      const trimmedString = result[0].nota.slice(1, -1); 
      const array = trimmedString.split(',');
      const hilos = array.length;
      const empresa = result[0].empresa;

     
     const sql = `INSERT INTO metricas (ticket, empresa, fecha, hilos, facturado, clave, tiempo, puntuacion) 
     VALUES ('${ticket}', '${empresa}', '${fecha}', '${hilos}', '${facturado}', '${clave}', '${tiempo}', '${puntuacion}')`;

conector.query(sql, function(err, result, fields) {
if (err) throw err;
console.log("Registro insertado:", result);
});

 

    res.send(true)

})
   
    })


    app.post('/editstock', (req, res) => {

    
      let valor = req.body.Valor;
      let sector = req.body.sector;
      let codigo = req.body.codigo;

if(sector == "1" ){

  const sql2= `UPDATE stock  set categoria = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)  }  
              
              else if (sector == "2") {

          const sql2= `UPDATE stock  set sn = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        }       else if (sector == "3") {

          const sql2= `UPDATE stock set descripcion = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        } else if (sector == "4") {

          const sql2= `UPDATE stock set estado = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        } else if (sector == "5") {

          const sql2= `UPDATE stock set factura = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        } else if (sector == "6") {

          const sql2= `UPDATE stock set destino = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        } else if (sector == "7") {

      res.send(true)


        } else if (sector == "8") {

          res.send(true)


        } else if (sector == "9") {

          const sql2= `UPDATE stock set nota = '${valor}' WHERE codigo ='${codigo}'`
          conector.query(sql2, function(err,result,filed) {
              if (err) throw err
              console.log(result[0])});  res.send(true)


        }
     
     
     
      })

    
      app.post('/resivireporte', (req, res) => { 


       let correo = req.session.correo;

     let  asunto =  'Reporte Generado por ' + correo;


         const correoSalida = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
      user: process.env.CORREOERRORS,
      pass: process.env.PSSCORREOERRORS
  }
});  

const opcionesCorreo = {
  from: process.env.CORREOERRORS,
  to: process.env.ENVIOCORREOERRORS ,
  subject: asunto ,
  text: req.body.contenido

};

correoSalida.sendMail(opcionesCorreo, (error, info) => {
  if (error) {
    console.log('Error al enviar el correo:', error);
  } else {
    console.log('Correo enviado con éxito:', info.response);
  }
});

res.send(true)


      })


      ///////////////////////////// Alertas 

 
// Expresión cron para ejecutar a las 9:00 AM de lunes a viernes en Argentina
// Los campos son: minutos (0-59), horas (0-23), día del mes (1-31), mes (1-12), día de la semana (0-7 donde 0 y 7 son domingo)
/*const task = cron.schedule('0 9 * * 1-5', () => { */

const task = cron.schedule('40 8 * * 1-5', () => {
  setTimeout(revisarTareasConFechaActual, 3000);
  const mailjefes=`SELECT * FROM intervia `
  conector.query(mailjefes, function(err,result8,filed) { 

    for (var i = 0; i < result8.length; i++) {
    const arrayActivo = result8[i].valid5.split('');
    console.log(result8.valid4 + arrayActivo[5] )
    if(arrayActivo[5] == "1" && result8[i].valid4 == "1" ) {  
          maildiario(result8[i].correo)
   
      }
      
    }


  })

  

  
}, {

  scheduled: true, // Programación activada
  timezone: 'America/Argentina/Buenos_Aires', // Zona horaria de Argentina


});

task.start(); // Inicia la tarea programada





function  maildiario(correosalida) {





   const sql = `SELECT * FROM tikets WHERE estado = 'En Proceso' UNION SELECT * FROM tikets WHERE estado = 'Aguardando'`;
   conector.query(sql, function(err, result, fields) {
     if (err) throw err;

     FiltoyRetorno (result)

     const resultadosUnificados = result;
    let numeracion = "Tickets Abiertos (" + resultadosUnificados.length + ") en dia de hoy";

   


  
function htmldiario(data) {

  
  var result = "";
  
  for (var i = 0; i < data.length; i++) {
  

   result +=  '    <div class="foondo">   <h5 class="usuario"> Usuario:  ' +  data[i].nomape + '  </h5> <div>  <h2 class="asunto"> Ticket:' +  data[i].ntiket + '  Asunto :  ' + data[i].asunto + '</h2> <h3 class="estado">' + data[i].estado + '</h3> </div> <p class="info"> Detalle del soporte :  ' + data[i].descripcion + '</p> </div>';




  }
  
  return result;
  
  }
  


  let Cuerpo =   `
  <html>
    <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <style>
    *{
      font-family: 'Poppins', sans-serif !important;
    }
   
    .Bloque1 {
      width: 50%;
      margin-left: 25%;
      background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
      background-size: contain !important;
      margin-top: 5%;
      border-radius: 5px;
    }
    
    .Bienvenido {
      width: 100%;
      text-align: center;
      color: rgb(127, 87, 157);
    }
    .Registrarme {
      width: 50%;
      margin-left: 25%;
      margin-bottom: 10%;
      text-align: center;
      display: block;
      text-decoration: none;
      color: black;
      border-bottom: solid 4px #8fdff3 ;
      border-bottom-width: 10%;
      font-size: 15px;
      text-decoration: none;
    }
    .info {
      color: #000000;
  padding-left: 12%;
  padding-right: 20%;
  margin-top: 3%;
  padding-bottom: 5%;
  font-size: 11px;
  width: 78%;
  text-align: center;
    }

    .asunto {
      margin-bottom: 0;
  width: 74%;
  margin-left: 13%;
  text-align: center;
  display: block;
  text-decoration: none;
  color: rgb(0, 0, 0);
  box-shadow: 0 0 10px rgb(245, 243, 243); /* Sombra */
  background: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  text-decoration: none;

    }
    .estado {
      border: white 1px solid;
      margin-top: 3px;
      width: 50%;
      margin-left: 25%;
      text-align: center;
      display: block;
      text-decoration: none;
      color: black;
      border-bottom-width: 10%;
      font-size: 15px;
      text-decoration: none;
      background: rgba(255, 255, 255, 0) !important;
      box-shadow: 5px 5px 10px rgba(0, 0, 0)!important;

    }

    .foondo {

      background: #8fdff34d;
      margin: 40px;
      border-radius: 5px;
      border: solid 2px #067894;
      box-shadow: 0 0 10px rgba(0, 0, 0) !important; /* Sombra */
    }
    .usuario {

        width: 50%;
        margin-left: 25%;
        text-align: center;
        background: #353a3b00;
        border-bottom: rgb(31, 29, 29) 2px solid;
        font-size: 9px;
        

    }



    </style>
    </head>
    <body>
 
      <div class="Bloque1">
        <h1 class="Bienvenido">Tareas de Hoy</h1>
        <a class="Registrarme" href="https://www.soporte.intervia.com.ar/historialg"> Click para ver el Hisotial Global </a>

        ${htmldiario(resultadosUnificados)}
       

      </div>
    
    </body>
  </html>
   





  `;








  sendEmail( numeracion , Cuerpo, correosalida )

});

}



//////////////subir imagen a ticket

app.post('/imagenhistorialg', (req, res) => {
  // Accede a los datos enviados en el cuerpo de la solicitud POST
  const ticket = req.body.ticket; // Obtiene el campo 'ticket' del objeto JSON
  
const ticketMayuscula = ticket.charAt(0).toUpperCase() + ticket.slice(1);

  const datosBinarios = req.body.datosBinarios; // Obtiene el campo 'datosBinarios' del objeto JSON


  let imgtk = "IM"+ticketMayuscula;

  console.log(imgtk)

  const sql= `UPDATE tikets set captura ='${ticketMayuscula}' WHERE  ntiket= '${ticket}'  `
                                       conector.query(sql, function(err,result,filed) {
                                          if (err) throw err
                                           console.log("echo");
                                       
                                       })



  // Realiza cualquier procesamiento adicional necesario con los datos

  // Por ejemplo, puedes guardar los datos binarios como una imagen en el servidor
  const fs = require('fs');
  const fileName = 'uploads/' + imgtk + '.jpg'; // Nombre del archivo de imagen
  fs.writeFileSync(fileName, Buffer.from(datosBinarios, 'base64'));

  // Luego, puedes enviar una respuesta al cliente, por ejemplo, confirmando el éxito de la carga
  res.status(200).json({ message: 'Imagen cargada y guardada exitosamente' });





});



///////////////////////////Correos Con Copias


app.post('/enviodeticketconcopias', (req, res) => {



  const Ticket= req.body.tiket;
  const Lista = GrupoSoporte(req.body.correos)
  const Asunto = "Informe Ticket " + Ticket + " "+ req.body.asunto;
  const Mensaje = req.body.cuerpo;
  const CorreoPrincipal = req.session.correo;
  const Usuario = req.session.nombre;
  infostock()
  let resultadoConsulta = null;

  function infostock() {
    const sql = `SELECT * FROM stock WHERE entregado = '${Ticket}'`;
  
    conector.query(sql, function(err, result, fields) {
      if (err) {
        console.error(err);
      } else {
        if (result.length === 0) {
          resultadoConsulta = "<p class='infoS' > Sin uso de stock </p>";
        } else {
          const paragraphs = result.map(item => `<p class="infoS"> Categoria : ${item.categoria} Descripcion:  ${item.descripcion} Serial: ${item.sn}</p>`);
          resultadoConsulta = paragraphs;
        }
      }
    });
  }



function GrupoSoporte(Lis) {
  const index = Lis.indexOf("GrupoSoporte");
  
  if (index !== -1) {
    // Eliminar "GrupoSoporte" del arreglo
    Lis.splice(index, 1);
  
    // Agregar los nuevos elementos al arreglo
    Lis.push("soporte2@rhglobal.com.ar", "Soporte3@rhglobal.com.ar","hhernandez@rhglobal.com.ar");
  
    console.log("Se eliminó 'GrupoSoporte' y se agregaron nuevos elementos:");
    return Lis
    
  } else {
    console.log("No se encontró 'GrupoSoporte' en el arreglo. No se realizaron modificaciones.");
    return Lis
  }}
  

  function parrafosHilos(data1) {


    if(data1 == null) { return  "<p class='infoHilo'> Sin detalles </p> " } else { 
    console.log(data1)
  
  let data = data1.split(',').map(item => item.trim());
  
  var result = "";

  var infoHilo = "infoHilo"; // Clase para números pares
var infoCuerpo = "infoCuerpo";
  
  for (var i = 0; i < data.length; i++) {
    var clase = i % 2 === 0 ? infoHilo : infoCuerpo; // Usa el operador % para determinar si i es par o impar
    result += '<p class="' + clase + '">' + data[i] + "</p> ";
  }
  
  return result;
  
  } }
  




  const sql = `SELECT * FROM tikets WHERE ntiket = '${Ticket}'`;
  conector.query(sql, function(err, result, fields) { 

    var cadenaResultante 




    infostock()

    function infostock() {
    const sql = `SELECT * FROM stock WHERE entregado = '${Ticket}'`;
    conector.query(sql, function(err, result, fields) {
      var paragraphs = "";
  if(result == "") { return cadenaResultante = "<p> Sin uso de stock </p>;"} else {
  
     cadenaResultante = result.map(item => `<p class="infoS"> Categoria : ${item.categoria} Descripcion:  ${item.descripcion} Serial: ${item.sn}</p>`);
  
  
  
  
  }
  
  
  
  
     })}
  



   let correohtml = `
   <html>
       <head>
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
       <meta charset="utf-8">
       <style>
         *{
           font-family: 'Poppins', sans-serif;
         }
         body {
           background: rgba(252, 252, 255, 0);
       
         }
     .Bloque1 {
       border: solid rgb(61, 208, 203) 3px;
     padding: 35px;
     width: 50%;
     margin-left: 25%;
     background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
     background-size: cover;
     margin-top: 5%;
     border-radius: 5px;
     }
         
         .Bienvenido {
           width: 100%;
           text-align: center;
            font-size: 18px;
           color: rgb(127, 87, 157);
         }
         .Registrarme {
           width: 50%;
           margin-left: 25%;
           text-align: center;
           display: block;
           text-decoration: none;
           color: black;
           border-bottom: solid 4px #8fdff3 ;
           border-bottom-width: 10%;
           font-size: 15px;
           text-decoration: none;
         }
     
         .infoTitulo {
           color: #413f3fe6;
     margin: 2px;
     border: 0px;
     font-size: 15px;
     text-align: center;
     border-radius: 5px;
         }
     
         .info {
           color: #000000;
           padding-left: 20%;
           padding-right: 20%;
           margin-top: 10%;
           padding-bottom: 10%;
           text-align: center;
           font-size: 20px;
         }
     
     
         
         .infoS {
           color: #000000;
       padding-left: 20%;
       padding-right: 20%;
       margin-top: 1%;
       padding-bottom: 0%;
       text-align: center;
       font-size: 20px;
         }
     
     
         .Bloque2 {
           background: rgba(163, 163, 163, 0.416);
           border-radius: 4px;
         }
     
     .pieDePagina {
     
       background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
       width: 80%;
       height: 20%;
       border-radius: 4px;
       margin-left: 10%;
     }
     
     .pieDePagina img {
       height: 100%;
       width: 100%;
       box-sizing: border-box;
       padding: 5%; 
     }
   
   
     .TituloHilo {
       background-color: #333; /* Color de fondo oscuro */
       color: #fff; /* Texto en blanco */
       font-size: 1.2em; /* Aumentar tamaño de fuente */
       padding: 10px; /* Relleno en todos los lados */
       border-radius: 5px; /* Bordes redondeados */
       margin: 10px 0; /* Margen superior e inferior */
       border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
       text-align: center;
   }
   
   .InfoHilo {
       text-align: center;
       background-color: #f9f9f9; /* Color de fondo claro */
       color: #333; /* Texto oscuro */
       padding: 8px; /* Relleno en todos los lados */
       border-radius: 5px; /* Bordes redondeados */
       margin-top: 5px; /* Margen superior */
   }
   
   .bloque-ticket {
       border: 1px solid #e0e0e0;
       padding: 20px;
       border-radius: 10px;
       max-width: 600px;
       margin: 20px auto;
       background-color: #f9f9f9;
   }
   
   .titulo-principal {
       color: #2c3e50;
       font-size: 18px;
       margin-bottom: 20px;
       border-bottom: 2px solid #00BFFF;
       padding-bottom: 10px;
       text-align: center;
   }
   
   .detalles-ticket {
       margin-top: 20px;
   }
   
   .detalle {
       margin: 10px 0;
       font-size: 18px;
   }
   
   .etiqueta {
       font-weight: bold;
       color: #7f8c8d;
   }
   .infoS {
     background-color: #ffffff6e; /* Color de fondo oscuro */
     color: #000000; /* Texto en blanco */
     font-size: 1.2em; /* Aumentar tamaño de fuente */
     padding: 10px; /* Relleno en todos los lados */
     border-radius: 5px; /* Bordes redondeados */
     margin: 10px 0; /* Margen superior e inferior */
     border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
     text-align: center;
   }

   

.Mensaje {
  text-align: left;
  background: rgb(18, 188, 211);
  color: white;
  font-size: 22px;
  margin: 0px;
  padding-left: 30px;
  
  
  }
  
  .Cuerpo-Mensaje {
  
    font-size: 15px;
    text-align: center;
    
  }
  .mensajecuerpo {
  border: solid 4px rgb(18, 188, 211);
  background: white;
  border-radius: 5px;
  
  }
   
   
     
     
       </style>
       </head>
       <body>
         
         <div class="Bloque1">
         <div class="mensajecuerpo"> <h5 class="Mensaje">${Usuario} . . . </h5> <br>
         <p class="Cuerpo-Mensaje">  ${Mensaje}</p> </div>


           <div class="bloque-ticket">
               <h1 class="titulo-principal">Ticket N° ${Ticket} </h1>
               <div class="detalles-ticket">
                   <div class="detalle"> <span class="etiqueta">Ticket:</span> ${Ticket}</div>
                   <div class="detalle"> <span class="etiqueta">Usuario:</span> ${result[0].nomape}</div>
                   <div class="detalle"> <span class="etiqueta">Correo:</span> ${result[0].correo}</div>
                   <div class="detalle"> <span class="etiqueta">Empresa:</span> ${result[0].empresa}</div>
                   <div class="detalle"> <span class="etiqueta">Estado:</span> ${result[0].estado}</div>
                   <div class="detalle"> <span class="etiqueta">Fecha:</span> ${result[0].Fecha}</div>
                   <div class="detalle"> <span class="etiqueta">Asunto:</span> ${result[0].asunto}</div>
               </div>
           </div>
           
   
         
           <h1 class="TituloHilo"> Detalles del Ticket </h1>
     
            <p class="InfoHilo">
            ${result[0].descripcion} </p>
            
            ${parrafosSoporte(result[0].nota)}
            
     
     
          
     
     
     
     
     
       <div class="pieDePagina">  
         <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
     
       </div>
     
         </div>
     
       
       </body>
     </html>
   
   `
   



sendEmailCopia(Asunto, correohtml ,CorreoPrincipal, Lista )



  })
 

  res.send(true);
  
  
  })


 





 







/////////////////////////// SISTEMA DE METRICAS //////////////////////////


app.post('/metricastotales', (req, res) => {
const metricas=`SELECT * FROM metricas `
conector.query(metricas, function(err,result,filed) {

  res.send(result)


 })


})


app.post('/Tkactualesparametricas', (req, res) => {



  const sql = `SELECT ntiket, empresa, Fecha, estado FROM tikets`;
  conector.query(sql, function(err, result, fields) {
    if (err) throw err;
    // Aquí puedes acceder a los resultados que incluyen solo las columnas especificadas
    console.log(result);
    res.send(result)
  });
  


})



function FiltoyRetorno (Parametro){


  tickets = Parametro;
let Aguardando = 0;
let EnProceso = 0; // Nótese que no puedes usar "En proceso" como nombre de variable debido al espacio.
let Finalizado = 0;

for (let ticket of tickets) {
  switch (ticket.estado) {
    case 'Aguardando':
      Aguardando++;
      break;
    case 'En Proceso':
      EnProceso++;
      break;
    case 'Finalizado':
      Finalizado++;
      break;
  }
}
guardado(Aguardando, EnProceso)
console.log(`Aguardando: ${Aguardando}`);
console.log(`En proceso: ${EnProceso}`);
console.log(`Finalizado: ${Finalizado}`);

}



function guardado(Aguardando, EnProceso) {

  function ContadorTickets() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM tikets`;
      conector.query(sql, function(err, result, filed) {
        if (err) {
          reject(err);
        } else {
          resolve(result.length);
        }
      });
    });
  }
  

  function ContadorUsuarios() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM intervia`;
      conector.query(sql, function(err, result, filed) {
        if (err) {
          reject(err);
        } else {
          resolve(result.length);
        }
      });
    });
  }

  function ContadorEmpresa() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM empresa`;
      conector.query(sql, function(err, result, filed) {
        if (err) {
          reject(err);
        } else {
          resolve(result.length);
        }
      });
    });
  }

  // Obtiene la fecha actual
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0'); // Añade un cero si es necesario
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Añade un cero si es necesario
  const año = fecha.getFullYear();
  const fechaFormat = `${dia}-${mes}-${año}`;

  // ... [Tus funciones y declaraciones previas]

(async () => {
  const numUsuarios = await ContadorUsuarios();
  const numTickets = await ContadorTickets();
  const numEmpresas = await ContadorEmpresa();

  // Crea un objeto con la fecha y las métricas
  const dataObj = {
    fecha: fechaFormat,
    Aguardando: Aguardando,
    EnProceso: EnProceso,
    Usuarios: numUsuarios,
    Tickets: numTickets,
    Empresas: numEmpresas  
  };

  // Lee el archivo si ya existe y agrega la nueva entrada
  const filePath = path.join(__dirname, 'MetricasSeguimientoArchivoData.txt');
  if (fs.existsSync(filePath)) {
    const prevData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Verifica si la fecha ya existe en los datos anteriores
    const fechaExiste = prevData.some(entry => entry.fecha === dataObj.fecha);
    if (fechaExiste) {
      console.log("La fecha ya existe. Terminando el proceso.");
      return; // Termina el proceso aquí
    }

    prevData.push(dataObj);
    fs.writeFileSync(filePath, JSON.stringify(prevData, null, 2));
  } else {
    fs.writeFileSync(filePath, JSON.stringify([dataObj], null, 2));
  }
})().catch(error => {
  console.error('Error:', error);
});}



app.get('/SeguimientoDiario', (req, res) => {
  try {
      const filePath = path.join(__dirname, 'MetricasSeguimientoArchivoData.txt');
      const data = fs.readFileSync(filePath, 'utf8');
      
      res.status(200).json({ data: JSON.parse(data) });
  } catch (error) {
      res.status(500).send('Hubo un error al obtener los datos');
  }
});




////////////////////////////////    RECORDATORIOS



function guardarTarea(fecha, correo, recordatorio, ticket, asunto) {
  const nuevaTarea = { fecha, correo, recordatorio, ticket, asunto }; // Se agrega asunto aquí
  const filePath = path.join(__dirname, 'tareas.txt');

  // Verifica si el archivo existe
  if (fs.existsSync(filePath)) {
      // Lee el archivo y parsea su contenido
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      data.push(nuevaTarea);
      // Escribe de nuevo en el archivo con el nuevo objeto agregado
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } else {
      // Si el archivo no existe, crea uno nuevo con la tarea
      fs.writeFileSync(filePath, JSON.stringify([nuevaTarea], null, 2));
  }
}


/////////////////////////////////////



app.post('/establecerrecordatorio', (req, res) => {

  const Ticket= req.body.tiket;
  const Lista = GrupoSoporte(req.body.correos)
  const Asunto = req.body.asunto;
  const Mensaje = req.body.cuerpo;
  const CorreoPrincipal = req.session.correo;
  const fecha = req.body.fecha

  

  function GrupoSoporte(Lis) {
    const index = Lis.indexOf("GrupoSoporte");
    
    if (index !== -1) {
      // Eliminar "GrupoSoporte" del arreglo
      Lis.splice(index, 1);
    
      // Agregar los nuevos elementos al arreglo
      Lis.push("soporte2@rhglobal.com.ar", "Soporte3@rhglobal.com.ar","hhernandez@rhglobal.com.ar");
    
      console.log("Se eliminó 'GrupoSoporte' y se agregaron nuevos elementos:");
      return Lis
      
    } else {
      console.log("No se encontró 'GrupoSoporte' en el arreglo. No se realizaron modificaciones.");
      return Lis
    }}

    function combinarCorreos(correoPrincipal, listaCorreos) {
      // Asegura que listaCorreos es un array
      if (!Array.isArray(listaCorreos)) {
        listaCorreos = []; // Si no es un array, lo inicializa como un array vacío
      }
    
      // Añade correoPrincipal al principio del array listaCorreos
      // Puedes usar unspread operator para agregarlo al principio o al final
      return [correoPrincipal, ...listaCorreos];
    }
    

    guardarTarea(fecha, combinarCorreos(CorreoPrincipal, Lista), Mensaje, Ticket, Asunto)

    res.send(true)


})




function revisarTareasConFechaActual() {
  const filePath = path.join(__dirname, 'tareas.txt');

  // Verifica si el archivo existe
  if (fs.existsSync(filePath)) {
    // Lee el archivo y parsea su contenido
    const tareas = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    const fechaActual = new Date().toISOString().split('T')[0];

    // Recorre las tareas y verifica las fechas
    tareas.forEach(tarea => {
      console.log("ejecutando recorrido" , fechaActual)
      if (tarea.fecha === fechaActual) {
        // Si la fecha coincide, pasa la tarea a la función procesarTareaCoincidente
        procesarTareaCoincidente(tarea);
      }
    });
  } else {
    console.log('El archivo de tareas no existe.');
  }
}





function procesarTareaCoincidente(tarea) {

  let Ticket = tarea.ticket;
  let Asunto ="Recordatorio para hoy " + " "+ Ticket + " " +  tarea.asunto;
  let correo = eliminarCorreosRepetidos(tarea.correo);
  let Mensaje = tarea.recordatorio;


  function eliminarCorreosRepetidos(tarea) {
    if (Array.isArray(tarea.correo)) {
      // Crea un Set a partir del array para eliminar los valores duplicados
      // y luego convierte el Set de nuevo en un array
      tarea.correo = [...new Set(tarea.correo)];
    }
    return tarea;
  }







  const sql = `SELECT * FROM tikets WHERE ntiket = '${Ticket}'`;
  conector.query(sql, function(err, result, fields) { 



   let correohtml = `
   <html>
       <head>
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">
       <meta charset="utf-8">
       <style>
         *{
           font-family: 'Poppins', sans-serif;
         }
         body {
           background: rgba(252, 252, 255, 0);
       
         }
     .Bloque1 {
       border: solid rgb(61, 208, 203) 3px;
     padding: 35px;
     width: 50%;
     margin-left: 25%;
     background: url(https://www.soporte.intervia.com.ar/img/imagen_fondo.jpg);
     background-size: cover;
     margin-top: 5%;
     border-radius: 5px;
     }
         
         .Bienvenido {
           width: 100%;
           text-align: center;
            font-size: 18px;
           color: rgb(127, 87, 157);
         }
         .Registrarme {
           width: 50%;
           margin-left: 25%;
           text-align: center;
           display: block;
           text-decoration: none;
           color: black;
           border-bottom: solid 4px #8fdff3 ;
           border-bottom-width: 10%;
           font-size: 15px;
           text-decoration: none;
         }
     
         .infoTitulo {
           color: #413f3fe6;
     margin: 2px;
     border: 0px;
     font-size: 15px;
     text-align: center;
     border-radius: 5px;
         }
     
         .info {
           color: #000000;
           padding-left: 20%;
           padding-right: 20%;
           margin-top: 10%;
           padding-bottom: 10%;
           text-align: center;
           font-size: 20px;
         }
     
     
         
         .infoS {
           color: #000000;
       padding-left: 20%;
       padding-right: 20%;
       margin-top: 1%;
       padding-bottom: 0%;
       text-align: center;
       font-size: 20px;
         }
     
     
         .Bloque2 {
           background: rgba(163, 163, 163, 0.416);
           border-radius: 4px;
         }
     
     .pieDePagina {
     
       background:linear-gradient(101deg, rgba(125,88,161,1) 17%, rgba(64,55,109,1) 100%);;
       width: 80%;
       height: 20%;
       border-radius: 4px;
       margin-left: 10%;
     }
     
     .pieDePagina img {
       height: 100%;
       width: 100%;
       box-sizing: border-box;
       padding: 5%; 
     }
   
   
     .TituloHilo {
       background-color: #333; /* Color de fondo oscuro */
       color: #fff; /* Texto en blanco */
       font-size: 1.2em; /* Aumentar tamaño de fuente */
       padding: 10px; /* Relleno en todos los lados */
       border-radius: 5px; /* Bordes redondeados */
       margin: 10px 0; /* Margen superior e inferior */
       border-bottom: 3px solid #00BFFF; /* Subrayado de color celeste */
       text-align: center;
   }
   
   .InfoHilo {
       text-align: center;
       background-color: #f9f9f9; /* Color de fondo claro */
       color: #333; /* Texto oscuro */
       padding: 8px; /* Relleno en todos los lados */
       border-radius: 5px; /* Bordes redondeados */
       margin-top: 5px; /* Margen superior */
   }
   
   .bloque-ticket {
       border: 1px solid #e0e0e0;
       padding: 20px;
       border-radius: 10px;
       max-width: 600px;
       margin: 20px auto;
       background-color: #f9f9f9;
   }
   
   .titulo-principal {
       color: #2c3e50;
       font-size: 18px;
       margin-bottom: 20px;
       border-bottom: 2px solid #00BFFF;
       padding-bottom: 10px;
       text-align: center;
   }
   
   .detalles-ticket {
       margin-top: 20px;
   }
   
   .detalle {
       margin: 10px 0;
       font-size: 18px;
   }
   
   .etiqueta {
       font-weight: bold;
       color: #7f8c8d;
   }
   .infoS {
     background-color: #ffffff6e; /* Color de fondo oscuro */
     color: #000000; /* Texto en blanco */
     font-size: 1.2em; /* Aumentar tamaño de fuente */
     padding: 10px; /* Relleno en todos los lados */
     border-radius: 5px; /* Bordes redondeados */
     margin: 10px 0; /* Margen superior e inferior */
     border-bottom: 3px solid #1111119f; /* Subrayado de color celeste */
     text-align: center;
   }

   

.Mensaje {
  text-align: left;
  background: rgb(18, 188, 211);
  color: white;
  font-size: 22px;
  margin: 0px;
  padding-left: 30px;
  
  
  }
  
  .Cuerpo-Mensaje {
  
    font-size: 15px;
    text-align: center;
    
  }
  .mensajecuerpo {
  border: solid 4px rgb(18, 188, 211);
  background: white;
  border-radius: 5px;
  
  }
   
   
     
     
       </style>
       </head>
       <body>
         
         <div class="Bloque1">
         <div class="mensajecuerpo"> <h5 class="Mensaje">${result[0].nomape} . . . </h5> <br>
         <p class="Cuerpo-Mensaje">  ${Mensaje} </p> </div>


           <div class="bloque-ticket">
               <h1 class="titulo-principal">Ticket N° ${Ticket} </h1>
               <div class="detalles-ticket">
                   <div class="detalle"> <span class="etiqueta">Ticket:</span> ${Ticket}</div>
                   <div class="detalle"> <span class="etiqueta">Usuario:</span> ${result[0].nomape}</div>
                   <div class="detalle"> <span class="etiqueta">Correo:</span> ${result[0].correo}</div>
                   <div class="detalle"> <span class="etiqueta">Empresa:</span> ${result[0].empresa}</div>
                   <div class="detalle"> <span class="etiqueta">Estado:</span> ${result[0].estado}</div>
                   <div class="detalle"> <span class="etiqueta">Fecha:</span> ${result[0].Fecha}</div>
                   <div class="detalle"> <span class="etiqueta">Asunto:</span> ${result[0].asunto}</div>
               </div>
           </div>
           
   
         
           <h1 class="TituloHilo"> Detalles del Ticket </h1>
     
            <p class="InfoHilo">
            ${result[0].descripcion} </p>
            
            ${parrafosSoporte(result[0].nota)}
            
     
     
          
     
     
     
     
     
       <div class="pieDePagina">  
         <img src="https://www.soporte.intervia.com.ar/img/Intervia_inicio.png">
     
       </div>
     
         </div>
     
       
       </body>
     </html>
   
   `
   


   let uniqueCorreo = [...new Set(correo)];

   procesarArray(uniqueCorreo)


   function procesarArray(arrayd) {
    if (arrayd.length === 1) {
        Solo(arrayd); // Llama a la función Solo() si hay un solo elemento
    } else if (arrayd.length > 1) {
      let Variable1 = arrayd[0]; // El primer elemento
      let Variable2 = arrayd.slice(1); // Crea un arreglo con los elementos restantes

      // Aquí puedes usar Variable1 y Variable2 según necesites
      sendEmailCopia(Asunto, correohtml , Variable1 , Variable2) 
    } else {
        console.log("El array está vacío.");
    }
}

function Solo(a) {
  sendEmail(Asunto, correohtml , a[0]) 
}








  })}
 








    // 404 NOT FUND
app.use((req,res,next) => {
res.sendFile(path.resolve(__dirname,"tikets" ,"noacces404.html"))

});





