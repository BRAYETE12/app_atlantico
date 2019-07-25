var situr = angular.module("agenciaViajeApp", []);

situr.controller('caracterizacionAgenciaViajesCtrl', ['$scope','OfertaEmpleoServi', '$state', function ($scope,OfertaEmpleoServi, $state) {
    
    OfertaEmpleoServi.cargando();
    $scope.encuesta = { id:$state.params.id, TipoServicios: [] };
    
    
    OfertaEmpleoServi.getAgencia( $scope.encuesta.id , $state.params.offline)
    .then(function (data) {
        
        if($state.params.offline==0){
            $scope.encuesta = data.data ? data.data : $scope.encuesta;
        }
        else{
            if (data.Id > 0) {
                var arrayAux = [];
                if(data.TipoServicios != null){
                    if(data.TipoServicios.servicios_agencias.length > 0){
                        for(var i=0; i<data.TipoServicios.servicios_agencias.length;i++){
                            arrayAux.push(data.TipoServicios.servicios_agencias[i].id);
                        }
                    }
                }
                $scope.encuesta.TipoServicios = arrayAux;
                
                $scope.encuesta.Planes = data.Planes + ""
                $scope.encuesta.Otro = data.Otro
            }
        }
        
        for (var i=0; i<data.servicios.length; i++ ) {
            data.servicios[i].check =  $scope.encuesta.TipoServicios.indexOf(data.servicios[i].id)!=-1;
        }
        
        $scope.servicios = data.servicios;
        OfertaEmpleoServi.cerrarCargando();
        
    }).catch(function () {
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });

    
    $scope.guardar = function (DatosForm) {

       if (DatosForm.$valid && $scope.encuesta.TipoServicios.length>0) {
           
            OfertaEmpleoServi.cargando();
            OfertaEmpleoServi.guardarCaracterizacion( $state.params.id, $scope.encuesta, $state.params.offline)
            .then(function (data) {
                
                if (data.success) { $state.go( "app.OfertaagenciasViajes" , { id:$scope.encuesta.id , offline: $state.params.offline} ); }
                else { $scope.errores = data.errores; }
                
                OfertaEmpleoServi.cerrarCargando();
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            })

        } else {
            
        }



    }
    
    
    $scope.checklist = function(id, check){
        var index = $scope.encuesta.TipoServicios.indexOf(id);
        
        if( check==true  && index==-1){ $scope.encuesta.TipoServicios.push(id); return true; }
        else if ( check==false  && index!=-1){ $scope.encuesta.TipoServicios.splice(index,1); return false;  }
            
    }
    
}])

situr.controller('ofertaAgenciaViajesCtrl', ['$scope','OfertaEmpleoServi', '$state', function ($scope,OfertaEmpleoServi, $state) {
   
    OfertaEmpleoServi.cargando();
    $scope.encuesta = { id:$state.params.id };
    $scope.encuesta.personas = {};
    $scope.encuesta.ventaPlanes = false;
    
    
    OfertaEmpleoServi.getOfertaAgencia( $scope.encuesta.id, $state.params.offline )
    .then(function (data) {
        
        if($state.params.offline==0){
            $scope.encuesta = data.data ? data.data : $scope.encuesta;
        }
        else{
        
            if (data.id > 0) {
                $scope.encuesta.ofrecePlanesConDestino = data.ofreceplanes;
                if(data.personas_destino_con_viajes_turismos.length > 0){
                    $scope.encuesta.personas = data.personas_destino_con_viajes_turismos;
                    for(var i=0; i<$scope.encuesta.personas.length; i++){
                        $scope.encuesta.personas[i].internacional = parseInt($scope.encuesta.personas[i].internacional);
                        $scope.encuesta.personas[i].nacional = parseInt($scope.encuesta.personas[i].nacional);
                        $scope.encuesta.personas[i].numerototal = parseInt($scope.encuesta.personas[i].numerototal);
                    }
                }
                
                if(data.planes_santamarta != null){
                    $scope.encuesta.numero=parseInt(data.planes_santamarta.numero)
                    $scope.encuesta.magdalena=parseInt(data.planes_santamarta.residentes)
                    $scope.encuesta.nacional=parseInt(data.planes_santamarta.noresidentes)
                    $scope.encuesta.internacional=parseInt(data.planes_santamarta.extrajeros)
                }
                
                for(var i=0; i<data.servicios_agencias.length; i++){
                    if(data.servicios_agencias[i].id == 1){
                        $scope.encuesta.ventaPlanes = true;
                        break;
                    }
                }
                
            }
        }
        
        $scope.destinos = data.destinos;
        OfertaEmpleoServi.cerrarCargando();
        
    }).catch(function () {
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });

    $scope.guardar = function (DatosForm) {

       if (DatosForm.$valid) {
           
            OfertaEmpleoServi.cargando();
            
            OfertaEmpleoServi.guardarOfertaAgenciaViajes($state.params.id, $scope.encuesta, $state.params.offline)
            .then(function (data) {
                
                if (data.success) {
                    $state.go( "app.empleoTrimestral" , { id: $state.params.id, offline: $state.params.offline } );
                } else {
                    $scope.errores = data.errores;
                }
                
                OfertaEmpleoServi.cerrarCargando();
                
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            })

        } else {
            
        }



    }
}])