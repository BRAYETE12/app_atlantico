

angular.module('OfertaYempleo', [ 'servicios.ofertaYempleo', 'AppAlojamiento', 'transporteApp', 'restauranteApp', 'agenciasOperadorasApp', 'agenciaViajeApp' , 'AppEmpleo' ] )

.controller("ListadoEncuestasOfertaEmpeloCtrl",[ "$scope", "$state", "OfertaEmpleoServi",  function($scope, $state, OfertaEmpleoServi){
       
       OfertaEmpleoServi.cargando();
       
       $scope.offline = 0;
       
       OfertaEmpleoServi.getListadoEncuestas($scope.offline)
        .then(function(data){
            if($scope.offline==1){
               $scope.encuestas = data.encuestas; 
            }
            else{
                console.log(data);
            }
            
            OfertaEmpleoServi.cerrarCargando();
        }).catch(function(){
           alert("Error");
           OfertaEmpleoServi.cerrarCargando();
        });
    
        $scope.redireccionar = function (sw, encuesta) {  
            var ruta = "app.listadoProveedores";
            
            if(sw == 1){ //  oferta y caracterizacion       
                if($scope.tipo_id == 1){
               
                   ruta = encuesta.mes_id%3==0  ? "app.alojamientotrimestral" : "app.alojamientomensual";
               
                }else{
                  
                    if(encuesta.categoria_id == 15 || encuesta.categoria_id == 13){
                         ruta = "app.agenciasViajes";
                    }
                    else if(encuesta.categoria_id == 14){
                         ruta = "app.caracterizacionAgenciasOperadora";
                    }
                    else if(encuesta.categoria_id == 21 || encuesta.categoria_id == 22 || encuesta.categoria_id == 23){
                         ruta = "app.caracterizacionTransporte";
                    }
                    else if(encuesta.categoria_id == 11 || encuesta.categoria_id == 12 || encuesta.categoria_id == 16 || encuesta.categoria_id == 25 ){
                         ruta = "app.caracterizacionAlimentos";
                    }
                }
            }
            else { // Empleo
                ruta = encuesta.mes_id%3==0  ? "app.empleoMensual" : "app.empleo";
            }
            
            $state.go( ruta , {id:encuesta.id} );
        };
        
}])


.controller("ListadoProveedoresCtrl",[ "$scope", "$state", "OfertaEmpleoServi",  function($scope, $state, OfertaEmpleoServi){
       
       OfertaEmpleoServi.cargando();
      
       OfertaEmpleoServi.getListadoProveedores()
        .then(function(data){
            $scope.proveedores = data.proveedores;
            OfertaEmpleoServi.cerrarCargando();
        }).catch(function(){
           alert("Error");
           OfertaEmpleoServi.cerrarCargando();
        });
    
        $scope.redireccionar = function (a , id) { 
            var internet = OfertaEmpleoServi.getEstadoInternet();
            $state.go( (a==1? "app.listadoEncuestasLLenas" : "app.listadoEncuestasSinLLenar") , {id:id,offline:internet} );  
        };
        
        $scope.cargarDatosOffline = function(){
            OfertaEmpleoServi.cargarDatos();
        }
        
        $scope.guardarEncuestasOffline = function(){
            OfertaEmpleoServi.guardarEncuestas();
        }
        
}])

.controller("ListadoEncuestasLlenasProveedoresCtrl",[ "$scope", "$state", "OfertaEmpleoServi",  function($scope, $state, OfertaEmpleoServi){
    
       OfertaEmpleoServi.cargando();
       $scope.id =  $state.params.id;
        
       OfertaEmpleoServi.getListadoEncuestasLLenasProveedores( $scope.id )
        .then(function(data){
            $scope.encuestas = data.encuestas;
            $scope.idtipo = data.tipo;
            $scope.idcategoria = data.categoria;
            OfertaEmpleoServi.cerrarCargando();
        }).catch(function(){
           alert("Error");
           OfertaEmpleoServi.cerrarCargando();
        });
        
        $scope.redireccionar = function (sw, encuesta) {  
            var ruta = "app.listadoProveedores";
            
            if(sw == 1){ //  oferta y caracterizacion       
                if($scope.idtipo == 1){
               
                   ruta = encuesta.mes_id%3==0  ? "app.alojamientotrimestral" : "app.alojamientomensual";
               
                }else{
                  
                    if($scope.idcategoria == 15 || $scope.idcategoria == 13){
                         ruta = "app.agenciasViajes";
                    }
                    else if($scope.idcategoria == 14){
                         ruta = "app.caracterizacionAgenciasOperadora";
                    }
                    else if($scope.idcategoria == 21 || $scope.idcategoria == 22 || $scope.idcategoria == 23){
                         ruta = "app.caracterizacionTransporte";
                    }
                    else if($scope.idcategoria == 11 || $scope.idcategoria == 12 || $scope.idcategoria == 16 || $scope.idcategoria == 25 ){
                         ruta = "app.caracterizacionAlimentos";
                    }
                }
            }
            else { // Empleo
                ruta = encuesta.mes_id%3==0  ? "app.empleoMensual" : "app.empleo";
            }
            
            $state.go( ruta , {id:encuesta.id} );
        };
    
}])

.controller("ListadoEncuestasSinLlenarProveedoresCtrl",[ "$scope", "$state", "OfertaEmpleoServi",  function($scope, $state, OfertaEmpleoServi){
      
       OfertaEmpleoServi.cargando();
       $scope.id =  $state.params.id; 
        
       OfertaEmpleoServi.getListadoEncuestasSinLLenarProveedores( $scope.id )
        .then(function(data){
            $scope.encuestas = data.encuestas;
            OfertaEmpleoServi.cerrarCargando();
        }).catch(function(){
            alert("Error");
            OfertaEmpleoServi.cerrarCargando();
        });
        
        $scope.redireccionar = function(encuesta) {  
            $state.go("app.actividadComercial", {mes:encuesta.mesId, anio:encuesta.anio, id:$scope.id,offline:$state.params.offline} );  
        };
    
}])

.controller('actividadComercialCtrl', ['$scope', '$state', 'OfertaEmpleoServi',function ($scope, $state, OfertaEmpleoServi) {
    
    OfertaEmpleoServi.cargando();
    $scope.actividad = {};
  
    
    OfertaEmpleoServi.getActividadComercial( $state.params.mes, $state.params.anio, $state.params.id, $state.params.offline  )
    .then(function(data){
        $scope.encuestadores = data.Encuestadores;
        $scope.actividad = data.data;
        OfertaEmpleoServi.cerrarCargando();
    }).catch(function(){
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });
  
    $scope.guardar = function (ActividadForm) {
        
        if (!ActividadForm.$valid) {
            alert("Error en los datos, corrija los errores e intente de nuevo.");
            return
        }
        
        OfertaEmpleoServi.cargando();
        $scope.actividad.anio = $state.params.anio;
        $scope.actividad.mes = $state.params.mes;
        
        OfertaEmpleoServi.guardarActvidadComercial($scope.actividad,$state.params.offline)
        .then(function (data) {
            
                if (data.success == true) {
               
                    var ruta = "app.listadoProveedores";
                    
                    if(data.tipo == 1){
                   
                       ruta = $state.params.mes%3==0  ? "app.alojamientotrimestral" : "app.alojamientomensual";
                   
                    }else{
                      
                        if($state.params.mes%3!=0){
                            ruta = "app.empleoMensual";
                        }
                        else if(data.categoria == 15 || data.categoria == 13){
                             ruta = "app.agenciasViajes";
                        }
                        else if(data.categoria == 14){
                             ruta = "app.caracterizacionAgenciasOperadora";
                        }
                        else if(data.categoria == 21 || data.categoria == 22 || data.categoria == 23){
                             ruta = "app.caracterizacionTransporte";
                        }
                        else if(data.categoria == 11 || data.categoria == 12 || data.categoria == 16 || data.categoria == 25 ){
                             ruta = "app.caracterizacionAlimentos";
                        }
                    }
                    
                    $state.go( ruta , { id: data.idEncuesta, offline: $state.params.offline } );
                       
                   
                } else { $scope.errores = data.errores; }
                
                OfertaEmpleoServi.cerrarCargando();
                
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            })
        
    }
    
}])