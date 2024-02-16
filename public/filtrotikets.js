function replay() { 

   location.reload();

}



EnvioGet();

function EnvioGet() { 

   document.getElementById("rnbus").style.display = "none";

	fetch('/sessiononline', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  if (data.online == true) { document.getElementById("Usuario").innerHTML=`${data.nombre}`
	 							 document.getElementById("Usuario").style.display = "inline-block"
	                             document.getElementById("iniciar").style.display ="none";	
								 document.getElementById("regis").style.display = "none";
								 document.getElementById("salir").style.display = "inline-block";
								 document.getElementById("Usuario1").style.display = "inline-block";}

		else				    { document.getElementById("salir").style.display = "none";}

	})} 



function salir() { 

	fetch('/salir', { method: 'GET'})
	.then(res => res.json())
	.then(data => {

	  function salir() { window.location.href = "index.html"; } ; salir()

	})} 




function historial() {
  
   document.getElementById("rnbus").style.display = "block";
   document.getElementById("bn3").style.display = "none";
   document.getElementById("nt").style.display = "none";
   document.getElementById("nbus").style.display = "none";
   document.getElementById("nbus2").style.display = "none";
   document.getElementById("empresa").style.display = "none";
    
   const nbus2 = document.getElementById("nbus2")
    nbus2.setAttribute(`style` , `display:none`)
 
    const empresa2 = document.getElementById("empresa")
    empresa2.setAttribute(`style` , `display:none`)
 
    const nbus = document.getElementById("nbus")
    nbus.setAttribute(`style` , `display:none`)
 
    const rnbus = document.getElementById("rnbus")
    rnbus.setAttribute(`style` , `display:block`)





    var select = document.getElementById("empresa");


   var opcionSeleccionada = select.options[select.selectedIndex];          
   var textoOpcion = opcionSeleccionada.textContent;
    let objeto = {  "empresa" : textoOpcion   }

    fetch("/historialfiltro", {
        method:"POST",
        headers: { 
           "Content-type": "application/json",
        },
        body:JSON.stringify(objeto),
     })
     .then(res => res.json())
     .then(json =>   {

      let reversa = json.reverse();
      console.log(reversa)
      for(i=0; i< reversa.length; i++ ){

         const colum = document.getElementById(`colum`)
         const colume = document.createElement("div")
         colume.setAttribute(`id` , `colum${i}` )
         colum.appendChild(colume)
   
         const btn = document.getElementById(`colum${i}`)
         const btne = document.createElement("button")
         btne.setAttribute(`class` , `btn` )
         btne.setAttribute(`id` , `tik${i}d` )
         btne.setAttribute(`onclick` , `borrar( '${i}' )` );
         btne.textContent = "";
         btn.appendChild(btne)
   
         const btn1 = document.getElementById(`colum${i}`)
         const btne1 = document.createElement("i")
         btne1.setAttribute(`class` , `fas fa-globe` )
         btne1.setAttribute(`id` , `tik${i}pub` )
         btne1.setAttribute(`onclick` , `publico( '${i}' )` );
         btne1.textContent = "";
         btn1.appendChild(btne1)
   
   
         const tiketsr = document.getElementById(`colum${i}`)
         const tiketser = document.createElement("p")
         tiketser.setAttribute(`class` , `numerotikk` )
         tiketser.textContent = "Numero de Ticket  :  ";
         tiketsr.appendChild(tiketser)
   
      
         
         const tikets = document.getElementById(`colum${i}`)
         const tiketse = document.createElement("h1")
         tiketse.setAttribute(`class` , `tikk` )
         tiketse.setAttribute(`id` , `tik${i}` )
         tiketse.textContent = reversa[i].ntiket;
         tikets.appendChild(tiketse)
   
     
   
         const tiketsru = document.getElementById(`colum${i}`)
         const tiketseru = document.createElement("p")
         tiketseru.textContent = "Nombre Del Usuario  :  ";
         tiketsru.appendChild(tiketseru)
   
   
         const Nombre = document.getElementById(`colum${i}`)
         const NombreE = document.createElement("h1")
         NombreE.setAttribute(`id` , `tik${i}dn` )
         NombreE.textContent = reversa[i].nomape;
         Nombre.appendChild(NombreE)

         

         const tiketsru1 = document.getElementById(`colum${i}`)
      const tiketseru1 = document.createElement("p")
      tiketseru1.textContent = "Empresa  :  ";
      tiketsru1.appendChild(tiketseru1)

      const Nombre1 = document.getElementById(`colum${i}`)
      const NombreE1 = document.createElement("h1")
      NombreE1.setAttribute(`id` , `tik${i}dn` )
      NombreE1.setAttribute(`class` , `empresa` )
      NombreE1.textContent = reversa[i].empresa;
      Nombre1.appendChild(NombreE1)
   
         const tiketsru2 = document.getElementById(`colum${i}`)
         const tiketseru2 = document.createElement("p")
         tiketseru2.textContent = "Asunto  :  ";
         tiketsru2.appendChild(tiketseru2)
   
         const asunto = document.getElementById(`colum${i}`)
         NombreE.setAttribute(`id` , `tik${i}d` )
         const asuntoe = document.createElement("h1")
         asuntoe.textContent = reversa[i].asunto;
         asunto.appendChild(asuntoe)
   
         const tiketsru2a = document.getElementById(`colum${i}`)
         const tiketseru2a = document.createElement("p")
         tiketseru2a.setAttribute(`class` , `estado` )
         tiketseru2a.textContent = "Estado  :  ";
         tiketsru2a.appendChild(tiketseru2a)
   
         const asuntoa = document.getElementById(`colum${i}`)
         const asuntoea = document.createElement("h1")
         asuntoea.textContent = reversa[i].estado;
         asuntoa.appendChild(asuntoea)
   
         const tiketsru3 = document.getElementById(`colum${i}`)
         const tiketseru3 = document.createElement("p")
         tiketseru3.textContent = "Fecha  :  ";
         tiketsru3.appendChild(tiketseru3)
   
         const fecha = document.getElementById(`colum${i}`)
         const fechae = document.createElement("h1")
         fechae.setAttribute(`id` , `tik${i}fe`)
         fechae.textContent = reversa[i].Fecha;
         fecha.appendChild(fechae)
       
   
   
   
         const btnd = document.getElementById(`colum${i}`)
         const btnde = document.createElement("button")
         btnde.setAttribute(`class` , `btn2 masbtn` )
         btnde.setAttribute(`id` , `tik${i}des` )
         btnde.setAttribute(`onclick` , `mas( '${i}' )` );
         btnde.textContent = "";
         btnd.appendChild(btnde)
   
         const btnda = document.getElementById(`colum${i}`)
         const btndea = document.createElement("button")
         btndea.setAttribute(`class` , `btnimg` )
         btndea.setAttribute(`id` , `tik${i}desaa` )
         btndea.setAttribute(`onclick` , `descarga( '${i}' )` );
         btndea.textContent = "Descargar Archivo Adjunto";
         btnda.appendChild(btndea)
   
   
         if(reversa[i].captura == "") {
            
            console.log("sin descarga")
            document.getElementById(`tik${i}desaa`).style.display = "none";
      
      
      } 
   
         
   
         const btndn = document.getElementById(`colum${i}`)
         const btnden = document.createElement("button")
         btnden.setAttribute(`class` , `btnM` )
         btnden.setAttribute(`id` , `tik${i}desM` )
         btnden.setAttribute(`style` , `display:none`)
         btnden.setAttribute(`onclick` , `menos( '${i}' )` );
         btnden.textContent = "";
         btndn.appendChild(btnden)
   
         const opciond = document.getElementById(`colum${i}`)
         const opcioned = document.createElement("h3")
         opcioned.setAttribute(`id` , `tik${i}dessed`)
         opcioned.setAttribute(`class` , `tikd`)
         opcioned.setAttribute(`style` , `display:none`)
         opcioned.textContent = "Detalle del Ticket";
         opciond.appendChild(opcioned);
         
         const descripcion = document.getElementById(`colum${i}`)
         const descripcione = document.createElement("h5")
         descripcione.setAttribute(`id` , `tik${i}desc`)
         descripcione.setAttribute(`class` , `tikd`)
         descripcione.setAttribute(`style` , `display:none`)
         descripcione.textContent = reversa[i].descripcion;
         descripcion.appendChild(descripcione);
   
         ///////////////////////////////////////
   
         const opcionda = document.getElementById(`colum${i}`)
         const opcioneda = document.createElement("h3")
         opcioneda.setAttribute(`id` , `tik${i}sop`)
         opcioneda.setAttribute(`class` , `tikd`)
         opcioneda.setAttribute(`style` , `display:none`)
         opcioneda.textContent = "Detalle de Soporte";
         opcionda.appendChild(opcioneda);
   
         const descripciona = document.getElementById(`colum${i}`)
         const descripcionea = document.createElement("h5")
         descripcionea.setAttribute(`id` , `tik${i}sop2`)
         descripcionea.setAttribute(`class` , `tikd`)
         descripcionea.setAttribute(`style` , `display:none`)
         descripcionea.textContent = reversa[i].nota;
         descripciona.appendChild(descripcionea);
   
   
   
   
         /////////////////////////////////////////
   
         const opciond1 = document.getElementById(`colum${i}`)
         const opcioned1 = document.createElement("h2")
         opcioned1.setAttribute(`id` , `tik${i}dessed2`)
         opcioned1.setAttribute(`class` , `tikd`)
         opcioned1.setAttribute(`style` , `display:none`)
         opcioned1.textContent = "Actualizar Informacion del Ticket";
         opciond1.appendChild(opcioned1);
         
   
         const caso = document.getElementById(`colum${i}`)
         const casoe = document.createElement("textarea")
         casoe.setAttribute(`id` , `tik${i}descin`)
         casoe.setAttribute(`class` , `tikd`)
         casoe.setAttribute(`type` , `text`)
         casoe.setAttribute(`style` , `display:none`)
         caso.appendChild(casoe);
   
         
       
   
   
         const opcion = document.getElementById(`colum${i}`)
         const opcione = document.createElement("select")
         opcione.setAttribute(`id` , `tik${i}desse`)
         opcione.setAttribute(`class` , `tikd`)
         opcione.setAttribute(`style` , `display:none`)
         opcione.textContent = reversa[i].descripcion;
         opcion.appendChild(opcione);
   
         //////Facturacion
   
         const facturacion = document.getElementById(`colum${i}`)
         const facturaciona = document.createElement("h1")
         facturaciona.setAttribute(`id` , `factu${i}ti`)
         facturaciona.setAttribute(`class` , `tikd1`)
         facturaciona.setAttribute(`style` , `display:none`)
         facturaciona.textContent = "Detalles de Facturacion";
         facturacion.appendChild(facturaciona);
   
         const casoa = document.getElementById(`colum${i}`)
         const casoea = document.createElement("textarea")
         casoea.setAttribute(`id` , `factu${i}desc`)
         casoea.setAttribute(`class` , `tikd`)
         casoea.setAttribute(`type` , `text`)
         casoea.setAttribute(`style` , `display:none`)
         casoa.appendChild(casoea);
   
         
   
   
   
   
         const factua = document.getElementById(`colum${i}`)
         const factua1 = document.createElement("input")
         factua1.setAttribute(`id` , `factu${i}ch`)
         factua1.setAttribute(`class` , `che`)
         factua1.setAttribute(`type` , `checkbox`)
         factua1.setAttribute(`style` , `display:none`)
         factua.appendChild(factua1);
   
   
         ////////////////
   
         const enviar = document.getElementById(`colum${i}`)
         const enviare = document.createElement("button")
         enviare.setAttribute(`class` , `btn2a` )
         enviare.setAttribute(`style` , `display:none`)
         enviare.setAttribute(`id` , `tik${i}envi` )
         enviare.setAttribute(`onclick` , `enviar( '${i}' )` );
         enviare.textContent = "Enviar";
         enviar.appendChild(enviare) } }
        
     
)  }


function buscador() { 
     
   document.getElementById("rnbus").style.display = "block";
   document.getElementById("bn3").style.display = "none";
   document.getElementById("nt").style.display = "none";
   document.getElementById("nbus").style.display = "none";
   document.getElementById("nbus2").style.display = "none";
   document.getElementById("empresa").style.display = "none";
 
     let nt = document.getElementById("nt").value; 
     let nt2 = "T"+nt;
     console.log(nt2)
     let objeto = {  "tiket" : nt2   }
 
     fetch("/buscadortiket", {
         method:"POST",
         headers: { 
            "Content-type": "application/json",
         },
         body:JSON.stringify(objeto),
      })
      .then(res => res.json())
      .then(json =>   {
 
       let reversa = json.reverse();
       console.log(reversa)
       for(i=0; i< reversa.length; i++ ){

         const colum = document.getElementById(`colum`)
         const colume = document.createElement("div")
         colume.setAttribute(`id` , `colum${i}` )
         colum.appendChild(colume)
   
         const btn = document.getElementById(`colum${i}`)
         const btne = document.createElement("button")
         btne.setAttribute(`class` , `btn` )
         btne.setAttribute(`id` , `tik${i}d` )
         btne.setAttribute(`onclick` , `borrar( '${i}' )` );
         btne.textContent = "";
         btn.appendChild(btne)
   
         const btn1 = document.getElementById(`colum${i}`)
         const btne1 = document.createElement("i")
         btne1.setAttribute(`class` , `fas fa-globe` )
         btne1.setAttribute(`id` , `tik${i}pub` )
         btne1.setAttribute(`onclick` , `publico( '${i}' )` );
         btne1.textContent = "";
         btn1.appendChild(btne1)
   
   
         const tiketsr = document.getElementById(`colum${i}`)
         const tiketser = document.createElement("p")
         tiketser.setAttribute(`class` , `numerotikk` )
         tiketser.textContent = "Numero de Ticket  :  ";
         tiketsr.appendChild(tiketser)
   
      
         
         const tikets = document.getElementById(`colum${i}`)
         const tiketse = document.createElement("h1")
         tiketse.setAttribute(`class` , `tikk` )
         tiketse.setAttribute(`id` , `tik${i}` )
         tiketse.textContent = reversa[i].ntiket;
         tikets.appendChild(tiketse)
   
     
   
         const tiketsru = document.getElementById(`colum${i}`)
         const tiketseru = document.createElement("p")
         tiketseru.textContent = "Nombre Del Usuario  :  ";
         tiketsru.appendChild(tiketseru)
   
   
         const Nombre = document.getElementById(`colum${i}`)
         const NombreE = document.createElement("h1")
         NombreE.setAttribute(`id` , `tik${i}dn` )
         NombreE.textContent = reversa[i].nomape;
         Nombre.appendChild(NombreE)

         const tiketsru1 = document.getElementById(`colum${i}`)
      const tiketseru1 = document.createElement("p")
      tiketseru1.textContent = "Empresa  :  ";
      tiketsru1.appendChild(tiketseru1)

      const Nombre1 = document.getElementById(`colum${i}`)
      const NombreE1 = document.createElement("h1")
      NombreE1.setAttribute(`id` , `tik${i}dn` )
      NombreE1.setAttribute(`class` , `empresa` )
      NombreE1.textContent = reversa[i].empresa;
      Nombre1.appendChild(NombreE1)
   
         const tiketsru2 = document.getElementById(`colum${i}`)
         const tiketseru2 = document.createElement("p")
         tiketseru2.textContent = "Asunto  :  ";
         tiketsru2.appendChild(tiketseru2)
   
         const asunto = document.getElementById(`colum${i}`)
         NombreE.setAttribute(`id` , `tik${i}d` )
         const asuntoe = document.createElement("h1")
         asuntoe.textContent = reversa[i].asunto;
         asunto.appendChild(asuntoe)
   
         const tiketsru2a = document.getElementById(`colum${i}`)
         const tiketseru2a = document.createElement("p")
         tiketseru2a.setAttribute(`class` , `estado` )
         tiketseru2a.textContent = "Estado  :  ";
         tiketsru2a.appendChild(tiketseru2a)
   
         const asuntoa = document.getElementById(`colum${i}`)
         const asuntoea = document.createElement("h1")
         asuntoea.textContent = reversa[i].estado;
         asuntoa.appendChild(asuntoea)
   
         const tiketsru3 = document.getElementById(`colum${i}`)
         const tiketseru3 = document.createElement("p")
         tiketseru3.textContent = "Fecha  :  ";
         tiketsru3.appendChild(tiketseru3)
   
         const fecha = document.getElementById(`colum${i}`)
         const fechae = document.createElement("h1")
         fechae.setAttribute(`id` , `tik${i}fe`)
         fechae.textContent = reversa[i].Fecha;
         fecha.appendChild(fechae)
       
   
   
   
         const btnd = document.getElementById(`colum${i}`)
         const btnde = document.createElement("button")
         btnde.setAttribute(`class` , `btn2 masbtn` )
         btnde.setAttribute(`id` , `tik${i}des` )
         btnde.setAttribute(`onclick` , `mas( '${i}' )` );
         btnde.textContent = "";
         btnd.appendChild(btnde)
   
         const btnda = document.getElementById(`colum${i}`)
         const btndea = document.createElement("button")
         btndea.setAttribute(`class` , `btnimg` )
         btndea.setAttribute(`id` , `tik${i}desaa` )
         btndea.setAttribute(`onclick` , `descarga( '${i}' )` );
         btndea.textContent = "Descargar Archivo Adjunto";
         btnda.appendChild(btndea)
   
   
         if(reversa[i].captura == "") {
            
            console.log("sin descarga")
            document.getElementById(`tik${i}desaa`).style.display = "none";
      
      
      } 
   
         
   
         const btndn = document.getElementById(`colum${i}`)
         const btnden = document.createElement("button")
         btnden.setAttribute(`class` , `btnM` )
         btnden.setAttribute(`id` , `tik${i}desM` )
         btnden.setAttribute(`style` , `display:none`)
         btnden.setAttribute(`onclick` , `menos( '${i}' )` );
         btnden.textContent = "";
         btndn.appendChild(btnden)
   
         const opciond = document.getElementById(`colum${i}`)
         const opcioned = document.createElement("h3")
         opcioned.setAttribute(`id` , `tik${i}dessed`)
         opcioned.setAttribute(`class` , `tikd`)
         opcioned.setAttribute(`style` , `display:none`)
         opcioned.textContent = "Detalle del Ticket";
         opciond.appendChild(opcioned);
         
         const descripcion = document.getElementById(`colum${i}`)
         const descripcione = document.createElement("h5")
         descripcione.setAttribute(`id` , `tik${i}desc`)
         descripcione.setAttribute(`class` , `tikd`)
         descripcione.setAttribute(`style` , `display:none`)
         descripcione.textContent = reversa[i].descripcion;
         descripcion.appendChild(descripcione);
   
         ///////////////////////////////////////
   
         const opcionda = document.getElementById(`colum${i}`)
         const opcioneda = document.createElement("h3")
         opcioneda.setAttribute(`id` , `tik${i}sop`)
         opcioneda.setAttribute(`class` , `tikd`)
         opcioneda.setAttribute(`style` , `display:none`)
         opcioneda.textContent = "Detalle de Soporte";
         opcionda.appendChild(opcioneda);
   
         const descripciona = document.getElementById(`colum${i}`)
         const descripcionea = document.createElement("h5")
         descripcionea.setAttribute(`id` , `tik${i}sop2`)
         descripcionea.setAttribute(`class` , `tikd`)
         descripcionea.setAttribute(`style` , `display:none`)
         descripcionea.textContent = reversa[i].nota;
         descripciona.appendChild(descripcionea);
   
   
   
   
         /////////////////////////////////////////
   
         const opciond1 = document.getElementById(`colum${i}`)
         const opcioned1 = document.createElement("h2")
         opcioned1.setAttribute(`id` , `tik${i}dessed2`)
         opcioned1.setAttribute(`class` , `tikd`)
         opcioned1.setAttribute(`style` , `display:none`)
         opcioned1.textContent = "Actualizar Informacion del Ticket";
         opciond1.appendChild(opcioned1);
         
   
         const caso = document.getElementById(`colum${i}`)
         const casoe = document.createElement("textarea")
         casoe.setAttribute(`id` , `tik${i}descin`)
         casoe.setAttribute(`class` , `tikd`)
         casoe.setAttribute(`type` , `text`)
         casoe.setAttribute(`style` , `display:none`)
         caso.appendChild(casoe);
   
         
       
   
   
         const opcion = document.getElementById(`colum${i}`)
         const opcione = document.createElement("select")
         opcione.setAttribute(`id` , `tik${i}desse`)
         opcione.setAttribute(`class` , `tikd`)
         opcione.setAttribute(`style` , `display:none`)
         opcione.textContent = reversa[i].descripcion;
         opcion.appendChild(opcione);
   
         //////Facturacion
   
         const facturacion = document.getElementById(`colum${i}`)
         const facturaciona = document.createElement("h1")
         facturaciona.setAttribute(`id` , `factu${i}ti`)
         facturaciona.setAttribute(`class` , `tikd1`)
         facturaciona.setAttribute(`style` , `display:none`)
         facturaciona.textContent = "Detalles de Facturacion";
         facturacion.appendChild(facturaciona);
   
         const casoa = document.getElementById(`colum${i}`)
         const casoea = document.createElement("textarea")
         casoea.setAttribute(`id` , `factu${i}desc`)
         casoea.setAttribute(`class` , `tikd`)
         casoea.setAttribute(`type` , `text`)
         casoea.setAttribute(`style` , `display:none`)
         casoa.appendChild(casoea);
   
         
   
   
   
   
         const factua = document.getElementById(`colum${i}`)
         const factua1 = document.createElement("input")
         factua1.setAttribute(`id` , `factu${i}ch`)
         factua1.setAttribute(`class` , `che`)
         factua1.setAttribute(`type` , `checkbox`)
         factua1.setAttribute(`style` , `display:none`)
         factua.appendChild(factua1);
   
   
         ////////////////
   
         const enviar = document.getElementById(`colum${i}`)
         const enviare = document.createElement("button")
         enviare.setAttribute(`class` , `btn2a` )
         enviare.setAttribute(`style` , `display:none`)
         enviare.setAttribute(`id` , `tik${i}envi` )
         enviare.setAttribute(`onclick` , `enviar( '${i}' )` );
         enviare.textContent = "Enviar";
         enviar.appendChild(enviare) } }
         
      
 )  }


 function menos(i) {  

   let id = "tik"+ i + "desc";
   let id2 = "tik"+ i + "descin";
   let id3 = "tik"+ i + "desse";
   let id4 = "tik"+ i + "envi";
   let id5 = "tik"+ i + "dessed";
   let id6 = "tik"+ i + "dessed2";
   let id7 = "tik"+ i + "des";
   let id8 = "tik"+ i + "desM";
   let id9 = "tik"+ i + "sop";
   let id10 = "tik"+ i + "sop2";
   let id11 = "factu"+i+"ti";
   let id12 = "factu"+i+"desc";
   let id13 = "factu"+i+"ch";
   
   
   
   
   document.getElementById(id).style.display  = "none";
   document.getElementById(id2).style.display = "none";
   document.getElementById(id3).style.display = "none";
   document.getElementById(id4).style.display = "none";
   document.getElementById(id5).style.display = "none";
   document.getElementById(id6).style.display = "none";
   document.getElementById(id7).style.display = "block";
   document.getElementById(id8).style.display = "none";
   document.getElementById(id9).style.display = "none";
   document.getElementById(id10).style.display = "none";
   document.getElementById(id11).style.display = "none";
   document.getElementById(id12).style.display = "none";
   document.getElementById(id13).style.display = "none";
   
   
   
   
   }
   
   
    
   function  mas(i) {
     
   
   
   let id = "tik"+ i + "desc";
   let id2 = "tik"+ i + "descin";
   let id3 = "tik"+ i + "desse";
   let id4 = "tik"+ i + "envi";
   let id5 = "tik"+ i + "dessed";
   let id6 = "tik"+ i + "dessed2";
   let id7 = "tik"+ i + "desM";
   let id8 = "tik"+ i + "des";
   let id9 = "tik"+ i + "sop";
   let id10 = "tik"+ i + "sop2";
   let id11 = "factu"+i+"ti";
   let id12 = "factu"+i+"desc";
   let id13 = "factu"+i+"ch";
   
   document.getElementById(id).style.display  = "block";
   document.getElementById(id2).style.display = "block";
   document.getElementById(id3).style.display = "block";
   document.getElementById(id4).style.display = "inline-block";
   document.getElementById(id5).style.display = "block";
   document.getElementById(id6).style.display = "block";
   document.getElementById(id7).style.display = "block";
   document.getElementById(id8).style.display = "none";
   document.getElementById(id9).style.display = "block";
   document.getElementById(id10).style.display = "block";
   document.getElementById(id11).style.display = "block";
   document.getElementById(id12).style.display = "block";
   document.getElementById(id13).style.display = "inline-block";
   
   
   
         const empresa21 = document.getElementById(id3)
         const empresae21 = document.createElement("option")
         empresae21.textContent = "Estado";
         empresa21.appendChild(empresae21);
   
         const empresa = document.getElementById(id3)
         const empresae = document.createElement("option")
         empresae.textContent = "En Proceso";
         empresa.appendChild(empresae);
   
         const empresa3 = document.getElementById(id3)
         const empresae3 = document.createElement("option")
         empresae3.textContent = "Aguardando";
         empresa3.appendChild(empresae3);
   
         const empresa2 = document.getElementById(id3)
         const empresae2 = document.createElement("option")
         empresae2.textContent = "Finalizado";
         empresa2.appendChild(empresae2);
   
    
      
         
       
   
   }
   
   
     
   function enviar(i) {
   
   
      var tiket = "tik" + i; 
      var select ="tik"+ i+ "desse";
      var actual = "tik" +i + "descin";
      let facturardes = "factu"+i+"desc";  
      let facturar = "factu"+i + "ch";
      let tiket2 = document.getElementById(tiket).innerHTML; 
      let select2 = document.getElementById(select).value; 
      let actual2 = document.getElementById(actual).value; 
      let descripcionfactu = document.getElementById(facturardes).value; 
      let facturar1 = document.getElementById(facturar).checked; 
   
      console.log(tiket2)
   
   
      tiketfinal = {
   
   "tiket" : tiket2,
   "select" : select2,
   "actual" : actual2,
   "facturardes" : descripcionfactu,
   "facturar" : facturar1
   }
   
   
   fetch("/uptiket", {
      method:"POST",
      headers: {"Content-type":"application/json"},
      body: JSON.stringify(tiketfinal),})
      .then(res => res.json())
      .then(json =>  { 
                   if (json == true) {  window.location.href = "historialg";    } else if (json == false) {alert("No se detectaron cambios porfavor verifique su respuesta")}
                                     }) 
   
   
   
   }


   function  borrar(i) {
      if (confirm("¿Estás seguro de que deseas eliminar el Ticket?")) {
         borrarok(i)
       } else {
         console.log("cancelado")
       } 
      
      }
   
   function  borrarok(i) {
      id = "tik" + i;
      console.log(id)
     var demo = document.getElementById(id);
     document.getElementById(id).style.background = "red";
   
   tiket  =  demo.innerHTML 
   console.log(tiket)
   objeto =   { "tiket" : tiket    }
   
   fetch("/delet", {
      method:"POST",
      headers: { 
         "Content-type": "application/json",
      },
   body: JSON.stringify( objeto )})
   .then(res => res.json())
   .then(json =>   {  
   
   
   
   
      }   )}
           
   
   
      function descarga(i) {
   
         console.log("ejecutando descarga")
   
        
   
         const h1 = document.getElementById("tik"+i);
         h1r = h1.innerHTML
         const imagen = "IM" + h1r + ".jpg";
         
       
         console.log(imagen)
         objeto =   { "imagen" : imagen  }
      
         fetch("/descargaimg", {
            method:"POST",
            headers: { 
               "Content-type": "application/json",
            },
         body: JSON.stringify( objeto )})
         .then(res => res.blob())
         .then(blob => {
   
            const imageUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "CampuraDelUsuario.jpg";
            link.click();
            // limpia la url temporal
            URL.revokeObjectURL(imageUrl);
   
   
         
         
            }   )}
   
   
   
      function publico(i) {
   
         var respuesta = confirm("¿Está seguro que desea hacer publico este ticket? asegurese de que el mismo no contenga informacion privada. Si desea que el ticket vuelva a ser privado contacte con el administrador del sitio");
   
         
   if (respuesta == true){
         id = "tik" + i;
         console.log(id)
        var demo = document.getElementById(id);
        document.getElementById(id).style.background = "blue";
      
      tiket  =  demo.innerHTML 
      console.log(tiket)
      objeto =   { "tiket" : tiket    }
      
      fetch("/tckpub", {
         method:"POST",
         headers: { 
            "Content-type": "application/json",
         },
      body: JSON.stringify( objeto )})
      .then(res => res.json())
      .then(json =>   {  
      
         if (json == true) {
            
            console.log("resivido true")
            window.location.href = "/p/" + tiket;    }
      
      
         }   )
         
   
   
   
   
      } else {console.log("Cancelado")} }
    
    
                               