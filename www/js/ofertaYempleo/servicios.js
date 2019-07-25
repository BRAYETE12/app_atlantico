 angular.module("servicios.ofertaYempleo",[])
    .service('OfertaEmpleoServi', ['$http', '$q', '$ionicLoading', '$ionicPopup', '$state', 'CONFIG', function($http,$q,$ionicLoading,$ionicPopup,$state,CONFIG ) {
      
      
      var http = {
          
            post: function (url,data) { return this.peticion("POST",url,data); },
             
            get: function(url){ return this.peticion("GET",url,null); },
            
            peticion: function(metodo, url, data){
                var defered = $q.defer();
                var promise = defered.promise;
                $http({  method : metodo,  url : CONFIG.data.APIURL + url,  data : data })
                .success(function (data) {  defered.resolve(data); })
                .error(function(err){  });  
                return promise; 
            },
            
            getData: function(key){
                var json = localStorage.getItem("ofertaYempleo");
                json = json ? JSON.parse(json) : {};
                return key ? json[key] : json;
            },
            premisa: function(data){
                var defered = $q.defer();
                var promise = defered.promise;
                defered.resolve(data);
                return promise; 
            },
            getEstadoInternet: function () {
                return 0;
            }
      };
      
      return {
          
            cargarDatos: function(){
                var th = this;
                th.cargando("Cargando datos..");
                http.get("/cargardatos")
                .then(function(data) {
                    localStorage.setItem('ofertaYempleo', JSON.stringify(data) );
                    th.cerrarCargando();
                });
            },
            
            getCargarDataSeccion: function (ruta, nombre, offline) {
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve( http.getData(nombre) );
                    return promise;
                }
                return http.get(ruta) ;
            },
            
            guardarDataSeccion: function(ruta,offline,id,model,nombre){
                if( offline==0 ){
                   var encuestas = JSON.parse( localStorage.getItem("EncuestasOfertaYempleo") );
                   for(var i=0;i<encuestas.length; i++){
                       if( encuestas[i].id == id ){
                            encuestas[i][nombre] = model;
                            localStorage.setItem('EncuestasOfertaYempleo', JSON.stringify(encuestas) );
                            return http.premisa( { success:true, idsitio: encuestas[i].actividadComercial.Sitio, sitio: encuestas[i].actividadComercial.Sitio } );
                       }
                   }
                   return http.premisa( { success:false } );
                }
                return http.post(ruta, model ); 
            },
            
            addEncuesta: function(item) {
                var json = localStorage.getItem("EncuestasOfertaYempleo");
                var encuestas = json ? JSON.parse(json) : [];
                
                var sw = 0;
                for(var i=0; i<encuestas.length;i++){
                    if(encuestas[i].id==item.id){ sw = 1; break; }
                }
                
                if( sw==0 ){
                    encuestas.push(item);
                }
                
                localStorage.setItem('EncuestasOfertaYempleo', JSON.stringify(encuestas) );
            },
            
            isTrismetralEncuesta: function(id){
                var encuestas = JSON.parse( localStorage.getItem("EncuestasOfertaYempleo") );
                for(var i=0;i<encuestas.length; i++){
                       if( encuestas[i].id == id ){
                            return encuestas[i].actividadComercial.mes % 3 == 0;
                       }
                }
            },
            getDataEncuesta: function(id, campo){
                var encuestas = JSON.parse( localStorage.getItem("EncuestasOfertaYempleo") );
                for(var i=0;i<encuestas.length; i++){
                       if( encuestas[i].id == id ){
                            return encuestas[i][campo];
                       }
                }
                
                return null;
            },
            
            ///////////////////////////////////////////////////////////////
            
            getListadoEncuestas: function(offline){
                if(offline==1){
                    return http.get("/encuestasrealizadastotales"); 
                }
                else{
                    var encuestas = JSON.parse( localStorage.getItem("EncuestasOfertaYempleo") );
                    return http.premisa(encuestas);
                }
                return this.getCargarDataSeccion("/encuestasrealizadastotales", "proveedores",0); 
                 
            },
            
            getListadoProveedores: function(offline){ 
                return this.getCargarDataSeccion("/listado", "proveedores",0); 
            },
            
            getListadoEncuestasLLenasProveedores: function(id){ return http.get("/encuestasrealizadas/"+id);  },
            getListadoEncuestasSinLLenarProveedores: function(id){ 
                if( http.getEstadoInternet()==0 ){
                   var data = http.getData("proveedores").proveedores;
                   for(var i=0;data.length; i++){
                       if(data[i].id==id){
                           return http.premisa( {"encuestas":data[i].encuestas} );
                       }
                   }
                   return http.premisa(null);
                }
                return http.get("/encuestaspendientes/"+id); 
            },
            
            //////////////////////// ACTIVIDAD COMERCIAL ///////////////////////////
            
            getActividadComercial: function(mes,anio,id,offline){
                if( offline==0 ){
                   var data = http.getData("proveedores").proveedores;
                   for(var i=0;data.length; i++){
                       if(data[i].id==id){
                           var dt = { Encuestadores: http.getData("encuestadores"), data: data[i].datos };
                           return http.premisa( dt );
                       }
                   }
                   return http.premisa(null);
                }
                return http.get("/dataactividadcomercial/"+mes+"/"+anio+"/"+id); 
            },
            guardarActvidadComercial: function(model,offline){ 
                if( offline==0 ){
                   var proveedores = http.getData("proveedores").proveedores;
                   for(var i=0;i<proveedores.length; i++){
                       if( proveedores[i].id == model.Sitio ){
                           for(var j=0;j<proveedores[i].encuestas.length;j++){
                               if(model.mes==proveedores[i].encuestas[j].mesId && model.anio==proveedores[i].encuestas[j].anio ){
                                   
                                   model.Anio = model.anio;
                                   model.Mes = model.mes;
                                   
                                   var encuesta = { id: model.Sitio+''+model.mes+''+model.anio, actividadComercial: model };
                                   this.addEncuesta(encuesta);
                                   return http.premisa({ success:true, idEncuesta: encuesta.id, tipo: proveedores[i].idtipo, categoria: proveedores[i].idcategoria });
                               }
                           }
                       }
                   }
                   return http.premisa( { success:false } );
                }
                return http.post("/guardaractividadcomercial", model );  
            },
            
            
            ////////////////////////////////////// SERVICIOS ALOJAMIENTOS ///////////////////////////////////////////////
            getDataAlojamiento: function(id,offline){
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("alojamiento");
                    var dataEncuesta = this.getDataEncuesta(id, "alojamiento");
                    if(dataEncuesta){
                        dataRecusos.servicios = dataEncuesta.servicios;
                        dataRecusos.alojamiento = dataEncuesta;
                        dataRecusos.numeroDias = this.getDataEncuesta(id, "actividadComercial").NumeroDias;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/dataalojamiento/"+id);  
            },
            GuardaralojamientoTrimestral: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardaralojamientotrimestral",offline,id,data,"alojamiento");
            },
            GuardaralojamientoMensual: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardaralojamientomensual",offline,id,data,"alojamiento");
            },
            //////////////////////////////////////////////////////////////////////////////////
            
            
            ////////////////////////////////////// SERVICIOS TRANSPORTE ///////////////////////////////////////////////
            getCaracterizacionTransporte: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve( { transporte:this.getDataEncuesta(id, "transporteCaracterizacion") } );
                    return promise;
                }
                return http.get("/infocaracterizaciontransporte/"+id);  
                
            },
            guardarCaracterizacionTransporte: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarcaracterizaciontransporte",offline,id,data,"transporteCaracterizacion");
            }, 
            //////////////////////////////////////////////////////////////////////////////////
            
            
            ////////////////////////////////////// SERVICIOS RESTAURANTES ///////////////////////////////////////////////
            getInfoAlimentosC: function(id,offline){ 
                
                 if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("caracterizacionAlimentos");
                    var dataEncuesta = this.getDataEncuesta(id, "alimentosCaracterizacion");
                    if(dataEncuesta){
                        dataRecusos.provision = dataEncuesta;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/infocaracterizacionalimentos/"+id);  
                
            },
            getInfoCapAlimentos: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve( { capacidad: this.getDataEncuesta(id, "alimentosCapacidad") } );
                    return promise;
                }
                return http.get("/infocapalimentos/"+id); 
            },
            
            GuardarCarAlimentos: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarcaralimentos",offline,id,data,"alimentosCaracterizacion");
            }, 
            GuardarOfertaAlimentos: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarofertaalimentos",offline,id,data,"alimentosCapacidad");
            }, 
            //////////////////////////////////////////////////////////////////////////////////  
            
             
             
            ////////////////////////////////////// SERVICIOS AGENCIAS OPERADORAS ///////////////////////////////////////////////
            getinfoCaracterizacionOperadora: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("caracterizacionAgenciasOperadoras");
                    var dataEncuesta = this.getDataEncuesta(id, "agenciaOperadoraCaracterizacion");
                    if(dataEncuesta){
                        dataRecusos.retornado = dataEncuesta;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/infocaracterizacionoperadora/"+id);  
                
                //return http.get("/infocaracterizacionoperadora/"+id);  
            },
            getOcuacionOperadora: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve( { prestamo: this.getDataEncuesta(id, "agenciaOperadoraOcupacion") } );
                    return promise;
                }
                return http.get("/cargardatosocupacionoperadoras/"+id); 
                
                //return http.get("/cargardatosocupacionoperadoras/"+id);  
            },
            
            guardarCaracterizacionOperadora: function(id,data,offline){ 
                return this.guardarDataSeccion("/crearcaracterizacionoperadora",offline,id,data,"agenciaOperadoraCaracterizacion");
            }, 
            guardarOcupacionOperadora: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarocupacionoperadora",offline,id,data,"agenciaOperadoraOcupacion");
            }, 
            //////////////////////////////////////////////////////////////////////////////////    
            
            
            ////////////////////////////////////// SERVICIOS AGENCIAS DE VIAJES ///////////////////////////////////////////////
            getAgencia: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("caracterizacionAgenciasViajes");
                    var dataEncuesta = this.getDataEncuesta(id, "agenciaViajesCaracterizacion");
                    if(dataEncuesta){
                        dataRecusos.data = dataEncuesta;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/agencia/"+id);  
                
                //return http.get("/agencia/"+id); 
            },
            getOfertaAgencia: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("ofertaAgenciasViajes");
                    var dataEncuesta = this.getDataEncuesta(id, "agenciaViajesOferta");
                    if(dataEncuesta){
                        dataRecusos.data = dataEncuesta;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/ofertaagencia/"+id);
                //return http.get("/ofertaagencia/"+id);  
            },
            
            guardarCaracterizacion: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarcaracterizacion",offline,id,data,"agenciaViajesCaracterizacion");
                //return http.post("/guardarcaracterizacion", data ); 
            }, 
            guardarOfertaAgenciaViajes: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarofertaagenciaviajes",offline,id,data,"agenciaViajesOferta");
                //return http.post("/guardarofertaagenciaviajes", data ); 
            },
            //////////////////////////////////////////////////////////////////////////////////    
            
            
            //////////////////////////////////////EMPLEO///////////////////////////////////////////////
            cargarDatosEmplMensual: function(id,offline){ 
                
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("empleoMensual");
                    var dataEncuesta = this.getDataEncuesta(id, "empleoMensual");
                    defered.resolve( dataEncuesta ? { empleo:dataEncuesta } : dataRecusos );
                    return promise;
                }
                 return http.get("/cargardatosdmplmensual/"+id);  
            },
            guardarEmpleoMensual: function(id,data,offline){
                return this.guardarDataSeccion("/guardarempleomensual",offline,id,data,"empleoMensual");
            }, 
            
            cargarDatosEmpleo: function(id,offline){ 
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("empleo");
                    var dataEncuesta = this.getDataEncuesta(id, "empleo");
                    defered.resolve( dataEncuesta ? { empleo:dataEncuesta } : dataRecusos );
                    return promise;
                }
                return http.get("/cargardatosempleo/"+id);  
            },
            guardarempleo: function(id,data,offline){ 
                return this.guardarDataSeccion("/guardarempleo",offline,id,data,"empleo");
            }, 
            
            cargarDatosEmplCaract: function(id,offline){ 
                if( offline==0 ){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    var dataRecusos = http.getData("empleoCaracterizacion");
                    var dataEncuesta = this.getDataEncuesta(id, "empleoCaracterizacion");
                    if(dataEncuesta){
                        dataRecusos.empleo = dataEncuesta;
                    }
                    defered.resolve( dataRecusos );
                    return promise;
                }
                return http.get("/cargardatosemplcaract/"+id);  
            },
            guardarEmpCaracterizacion: function(id,data,offline){
                return this.guardarDataSeccion("/guardarempcaracterizacion",offline,id,data,"empleoCaracterizacion");
            },
            
            //////////////////////////////////////////////////////////////////////////////////    
            
            
            getEstadoInternet: function(){ return http.getEstadoInternet() },
            
            ////////////////////////////////////////////////////////
            cargando: function(mensaje){
                
                mensaje = mensaje ? mensaje : "Espere por favor...";
                
                $ionicLoading.show({
                  template: '<ion-spinner></ion-spinner>' + mensaje,
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                });
                
            },
            cerrarCargando: function(){ $ionicLoading.hide(); },
            
            ////////////////////////////////////////////////////////
            
            ionicPopup:function (id, rutaEmpleo,offline) {
                    var confirmPopup = $ionicPopup.confirm({ 
                                                            title: "Realizado", 
                                                            template: "Se ha guardado satisfactoriamente la sección.",
                                                            buttons: [  
                                                                        { text: 'Listado de encuestas', type: 'button-balanced', onTap: function(e) { return false; } }, 
                                                                        { text:'Empleo', type:'button-positive',  onTap: function(e) { return true; } } 
                                                                    ]
                                                          });
                
                    confirmPopup.then(function(res) {
                         
                         if(!res) { // Redirecionar para listado de encuestas realizadas
                            $state.go( "app.listadoEncuestasLLenas" , {id:id} );
                         } else { // Redireccionar para empleo
                            $state.go( "app."+rutaEmpleo , {id:id, offline:offline } );
                         }
                         
                    });
                    
            },
            MensajeExitoso : function(id, offline){
                
                if( offline==0 ){
                    $ionicLoading.hide();
                    var rutaEmpleo = this.isTrismetralEncuesta(id) ? "empleoTrimestral" : "empleoMensual";
                    this.ionicPopup(id,rutaEmpleo,offline);
                }
                else{
                    http.get("/mesencuesta/"+id)
                    .then(function(data) {
                        $ionicLoading.hide();
                        var rutaEmpleo = data[0].mes_id %3==0 ? "empleoTrimestral" : "empleoMensual";
                        this.ionicPopup(id,rutaEmpleo,offline);
                    });
                }
                 
            },
            showAlertError : function() { $ionicPopup.alert({  title: 'Error',  template: 'Corrija los errores' }); },
        
        
         
           ////////////////////////////////////////////GUARDAR ENCUESTAS OFFLINE/////////////////////////////////////////////////////
           
            guardarEncuestas : function() {
               
                var encuestas = localStorage.getItem("EncuestasOfertaYempleo");
                encuestas = encuestas ? JSON.parse(encuestas) : [];
                
                 var THIS = this;
                
                for(var i=0;i<encuestas.length; i++){
                   
                    THIS.GuardarEncuestaActividadComercial( encuestas[i], THIS );
                        
                }
                
            },
           
            GuardarEncuestaActividadComercial: function( encuesta, THIS ){
                
                THIS.guardarActvidadComercial( encuesta.actividadComercial,1 )
                    .then(function(data) {
                            
                        if (data.success == true) {
                            
                            encuesta.idEncuesta = data.idEncuesta;
                            
                            if(data.tipo == 1){
                                THIS.guardarEncuestaAlojamiento(encuesta,THIS);
                            }else{
                              
                                if(encuesta.actividadComercial.Mes%3!=0){
                                    THIS.guardarEncuestaEmpleoMensual(encuesta,THIS);
                                }
                                else if(data.categoria == 15 || data.categoria == 13){
                                    THIS.guardarEncuestaAgenciaViaje(encuesta,THIS);
                                }
                                else if(data.categoria == 14){
                                    THIS.guardarEncuestaAgenciaOperadoras(encuesta,THIS);
                                }
                                else if(data.categoria == 21 || data.categoria == 22 || data.categoria == 23){
                                    THIS.guardarEncuestaTransporte(encuesta,THIS);
                                }
                                else if(data.categoria == 11 || data.categoria == 12 || data.categoria == 16 || data.categoria == 25 ){
                                    THIS.guardarEncuestaAlimentos(encuesta,THIS);
                                }
                            }
                            
                        } else { encuesta.actividadComercial.estadoEnvio = 0; }
                            
                    });
                
            },
           
            guardarEncuestaAlojamiento: function(encuesta,THIS){
               
               if( encuesta.actividadComercial.Mes%3==0 && encuesta.alojamiento ){ //alojamiento trimestral
                    
                    encuesta.alojamiento.encuesta = encuesta.idEncuesta;
                    
                    THIS.GuardaralojamientoTrimestral(null, encuesta.alojamiento ,1)
                       .then(function(data){
                            
                            if(data.success){
                                encuesta.alojamiento.estadoEnvio = 1;
                                THIS.guardarEncuestaEmpleoTrimestral(encuesta,THIS);
                            }
                            else{ encuesta.alojamiento.estadoEnvio = 0; }
                            
                       });
                       
               }
               else if( encuesta.alojamiento ){ //alojamiento mensual
                   
                   encuesta.alojamiento.encuesta = encuesta.idEncuesta;
                   
                    THIS.GuardaralojamientoMensual(null, encuesta.alojamiento ,1)
                       .then(function(data){
                            
                            if(data.success){
                                encuesta.alojamiento.estadoEnvio = 1;
                                THIS.guardarEncuestaEmpleoMensual(encuesta,THIS);
                            }
                            else{ encuesta.alojamiento.estadoEnvio = 0; }
                            
                       });
                   
               }
               else{
                   encuesta.estadoEnvio = 0;
               }
               
           },
            
            guardarEncuestaTransporte: function(encuesta,THIS){
                
                if(encuesta.transporteCaracterizacion){
                    
                    encuesta.transporteCaracterizacion.id = encuesta.idEncuesta;
                    
                   THIS.guardarCaracterizacionTransporte(null, encuesta.transporteCaracterizacion ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           encuesta.transporteCaracterizacion.estadoEnvio=1;
                           THIS.guardarEncuestaEmpleoTrimestral(encuesta,THIS);
                       }
                       else{ encuesta.transporteCaracterizacion.estadoEnvio=0; }
                        
                    });
               }
               else{ encuesta.transporteCaracterizacion.estadoEnvio=0; }
                
            },
            
            guardarEncuestaAlimentos: function(encuesta,THIS){
                
                if(encuesta.alimentosCaracterizacion){
                    
                    encuesta.alimentosCaracterizacion.id = encuesta.idEncuesta;
                    
                   THIS.GuardarCarAlimentos(null, encuesta.alimentosCaracterizacion ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           
                           encuesta.alimentosCaracterizacion.estadoEnvio = 1;
                           if( !encuesta.alimentosCapacidad ){ encuesta.alimentosCapacidad.estadoEnvio=0; return; }
                           
                           encuesta.alimentosCapacidad.id = encuesta.idEncuesta;
                           encuesta.alimentosCapacidad.tipo = encuesta.alimentosCaracterizacion.sirvePlatos;
                           
                           THIS.GuardarOfertaAlimentos(null,encuesta.alimentosCapacidad,1)
                           .then(function(data2) {
                                if( data2.success ){
                                   encuesta.alimentosCapacidad.estadoEnvio=1;
                                   THIS.guardarEncuestaEmpleoTrimestral(encuesta,THIS);
                                }
                                else{ encuesta.alimentosCapacidad.estadoEnvio=0; }
                                
                           });
                           
                       }
                       else{ encuesta.alimentosCaracterizacion.estadoEnvio=0; }
                        
                    });
               }
               else{ encuesta.alimentosCaracterizacion.estadoEnvio=0; }
                
            },
            
            guardarEncuestaAgenciaOperadoras: function(encuesta,THIS){
                
                if(encuesta.agenciaOperadoraCaracterizacion){
                   
                    encuesta.agenciaOperadoraCaracterizacion.id = encuesta.idEncuesta;
                   
                   THIS.guardarCaracterizacionOperadora(null, encuesta.agenciaOperadoraCaracterizacion ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           
                           encuesta.agenciaOperadoraCaracterizacion.estadoEnvio = 1;
                           if( !encuesta.agenciaOperadoraOcupacion ){ encuesta.agenciaOperadoraOcupacion.estadoEnvio=0; return; }
                           
                           encuesta.agenciaOperadoraOcupacion.id = encuesta.idEncuesta;
                           
                           THIS.guardarOcupacionOperadora(null,encuesta.agenciaOperadoraOcupacion,1)
                           .then(function(data2) {
                                if( data2.success ){
                                   encuesta.agenciaOperadoraOcupacion.estadoEnvio=1;
                                   THIS.guardarEncuestaEmpleoTrimestral(encuesta,THIS);
                                }
                                else{ encuesta.agenciaOperadoraOcupacion.estadoEnvio=0; }
                                
                           });
                           
                       }
                       else{ encuesta.agenciaOperadoraCaracterizacion.estadoEnvio=0; }
                        
                    });
               }
               else{ encuesta.agenciaOperadoraCaracterizacion.estadoEnvio=0; }
                
            },
            
            guardarEncuestaAgenciaViaje: function(encuesta,THIS){
                
                if(encuesta.agenciaViajesCaracterizacion){
                    
                    encuesta.agenciaViajesCaracterizacion.id = encuesta.idEncuesta;
                    
                    
                    THIS.guardarCaracterizacion(null, encuesta.agenciaViajesCaracterizacion ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           
                           encuesta.agenciaViajesCaracterizacion.estadoEnvio = 1;
                           if( !encuesta.agenciaViajesOferta ){ encuesta.agenciaViajesOferta.estadoEnvio=0; return; }
                           
                           encuesta.agenciaViajesOferta.id = encuesta.idEncuesta;
                           
                           THIS.guardarOfertaAgenciaViajes(null,encuesta.agenciaViajesOferta,1)
                           .then(function(data2) {
                                if( data2.success ){
                                   encuesta.agenciaViajesOferta.estadoEnvio=1;
                                   THIS.guardarEncuestaEmpleoTrimestral(encuesta,THIS);
                                }
                                else{ encuesta.agenciaViajesOferta.estadoEnvio=0; }
                                
                           });
                           
                       }
                       else{ encuesta.agenciaViajesCaracterizacion.estadoEnvio=0; }
                        
                    });
                    
                    
               }
               else{ encuesta.agenciaViajesOferta.estadoEnvio=0; }
                
            },
            
            guardarEncuestaEmpleoTrimestral: function(encuesta,THIS){
               
               if(encuesta.empleoMensual){ 
                   
                   encuesta.empleoMensual.Encuesta = encuesta.idEncuesta;
                   
                   THIS.guardarEmpleoMensual(null, encuesta.empleoMensual ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           
                           encuesta.empleoMensual.estadoEnvio = 1;
                           if( !encuesta.empleoCaracterizacion ){ encuesta.empleoCaracterizacion.estadoEnvio=0; return; }
                           
                           encuesta.empleoCaracterizacion.Encuesta = encuesta.idEncuesta;
                           
                           THIS.guardarEmpCaracterizacion(null,encuesta.empleoCaracterizacion,1)
                           .then(function(data2) {
                                if( data2.success ){
                                   encuesta.empleoCaracterizacion.estadoEnvio=1;
                                   return;
                                }
                                else{ encuesta.empleoCaracterizacion.estadoEnvio=0; }
                                
                           });
                           
                       }
                       else{ encuesta.empleoMensual.estadoEnvio=0; }
                        
                    });
               }
               else{ encuesta.estadoEnvio=0; }
           },
           
            guardarEncuestaEmpleoMensual: function(encuesta,THIS){
               
               if(encuesta.empleo){
                   
                   encuesta.empleo.Encuesta = encuesta.idEncuesta;
                   
                   THIS.guardarempleo(null, encuesta.empleo ,1)
                    .then(function(data1){ 
                       
                       if( data1.success ){
                           encuesta.empleo.estadoEnvio = 1;
                           return;
                       }
                       else{ encuesta.empleo.estadoEnvio=0; }
                        
                    });
               }
               else{ encuesta.estadoEnvio=0; }
           }
        
      };
      
      
    }]);
    