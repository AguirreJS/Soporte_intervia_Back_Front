




EnvioGet();

function EnvioGet() { 

	fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  if (data.online == true) { 
      document.getElementById("Usuario").innerHTML=`${data.nombre}`
	   document.getElementById("Usuario").style.display = "inline-block"
	   document.getElementById("iniciar").style.display ="none";	
		document.getElementById("regis").style.display = "none";
		document.getElementById("salir").style.display = "inline-block";
		document.getElementById("Usuario1").style.display = "inline-block";
   
   }

		else				    { document.getElementById("salir").style.display = "none";}

	})} 

   function salir() { 

      fetch('/salir', { method: 'GET'})
      .then(res => res.json())
      .then(data => {
   
        function salir() { window.location.href = "index.html"; } ; salir()
   
      })} 




function ingresar() {

   let empresa = document.getElementById("empresa").value;
   let dominio = document.getElementById("dominio").value;  
 console.log(empresa)


if (empresa == "") {
     alert("El nombre de la empresa no puede estar vacio")
   } else {


   const checkbox = document.getElementById("abonado").checked;

   console.log(checkbox)

   


    objeto =  {   "empresa" : empresa,
                  "dominio" : dominio,
                  "abonado": checkbox  }

    fetch("/ingempresa", {
	
        method:"POST",
        headers: {"Content-type":"application/json"},
           body: JSON.stringify(objeto),})
           .then(res => res.json())
           .then(json =>  {
                              if(json == true )  { window.location.href = "empresas";   } }


            
            ) }}




solicitude()

function solicitude() { 
 console.log("ejecutado")
    fetch("/listipbaneadas", {
	
        method:"POST",
        headers: {"Content-type":"application/json"},
           })
           .then(res => res.json())
           .then(json =>  { 
            console.log(json)
            for(i=0; i< json.length; i++ ){ 

      
                  
      const btn = document.getElementById("delete")
      const btne = document.createElement("button")
      btne.setAttribute(`class` , `btn` )
      btne.setAttribute(`id` , `tik${i}d` )
      btne.setAttribute(`onclick` , `borrar( '${i}' )` );
      btne.textContent = "habilitar";
      btn.appendChild(btne)

      const dominio = document.getElementById("dominio1")
      const dominioe = document.createElement("p")
      dominioe.setAttribute(`id` , `ipban${i}`)
      dominioe.setAttribute(`onclick` , `editarDominio( '${i}' )` );
      dominioe.textContent = json[i].ip;
      dominio.appendChild(dominioe)
      console.log(json[i].ip)

    const empresa = document.getElementById("empresa1")
    const empresae = document.createElement("p")
    empresae.textContent = json[i].correoAsociado;
    empresa.appendChild(empresae)
    console.log(json[i].empresa)


      const id = document.getElementById("id")
      const ide = document.createElement("p")
      ide.setAttribute(`id` , `tik${i}` )
      ide.textContent = json[i].intentos;
      id.appendChild(ide)



            } 


           })

 }


 function  borrar(i) {

    console.log("ejecutado")

    ipid = "ipban" + i;

    let ipban = document.getElementById(ipid).innerHTML; 

    console.log(ipban)


    objeto =  {   "ip" : ipban,
                  }

    fetch('/desbaneo', {
	
        method:"POST",
        headers: {"Content-type":"application/json"},
           body: JSON.stringify(objeto),})
           .then(res => res.json())
           .then(json =>  {
                              if(json == true )  { window.location.href = "baneados";   } }


            
            ) }




 
    

            historialipconectadas()



            function historialipconectadas() { 
               console.log("ejecutado")
                  fetch('/listipconectadas', {
                 
                      method:"POST",
                      headers: {"Content-type":"application/json"},
                         })
                         .then(res => res.json())
                         .then(json =>  { 
                          console.log(json)
                          for(i=0; i< json.length; i++ ){ 
              
                    
                                
                    const btn = document.getElementById("delete1")
                    const btne = document.createElement("button")
                    btne.setAttribute(`class` , `btn` )
                    btne.setAttribute(`id` , `tik${i}d` )
                    btne.setAttribute(`onclick` , `borrar(  )` );
                    btne.textContent = "habilitar";
                    btn.appendChild(btne)
              
                    const dominio = document.getElementById("dominio11")
                    const dominioe = document.createElement("p")
                    dominioe.setAttribute(`id` , `ipban${i}`)
                    dominioe.textContent = json[i].ip;
                    dominio.appendChild(dominioe)
                    console.log(json[i].ip)
              
                  const empresa = document.getElementById("empresa11")
                  const empresae = document.createElement("p")
                  empresae.textContent = json[i].correoAsociado;
                  empresa.appendChild(empresae)
                  console.log(json[i].empresa)
              
              
                    const id = document.getElementById("id1")
                    const ide = document.createElement("p")
                    ide.setAttribute(`id` , `tik${i}` )
                    ide.textContent = json[i].intentos;
                    id.appendChild(ide)
              
              
              
                          } 
              
              
                         })
              
               }


    

