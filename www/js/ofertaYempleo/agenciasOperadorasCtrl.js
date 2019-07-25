angular.module('agenciasOperadorasApp', [] )



.controller('ocupacionAgenciasOperadoraCtrl', function ($scope, $state,  OfertaEmpleoServi) {
    
    OfertaEmpleoServi.cargando();
    $scope.agencia = { actividades: [], toures: [] };
    
    $scope.id = $state.params.id;
   
    OfertaEmpleoServi.getOcuacionOperadora( $scope.id, $state.params.offline )
    .then(function (data) {
        if(data.prestamo){ $scope.agencia = data.prestamo; }
        OfertaEmpleoServi.cerrarCargando();
    }).catch(function () {
        OfertaEmpleoServi.cerrarCargando();
        alert("Error");
    });
   
    $scope.guardar = function (ocupacionForm) {
        
        if (!ocupacionForm.$valid || (($scope.agencia.porcentajeC + $scope.agencia.porcentajeE + $scope.agencia.porcentajeM) != 100) && $scope.agencia.totalP != 0 ) {
            OfertaEmpleoServi.showAlertError(); return;
        }

        $scope.agencia.id = $state.params.id;
        
        OfertaEmpleoServi.cargando();
        OfertaEmpleoServi.guardarOcupacionOperadora($state.params.id, $scope.agencia, $state.params.offline)
        .then(function (data) {
            
            if (data.success) {
               $state.go( "app.empleoTrimestral" , { id: $state.params.id, offline: $state.params.offline } );
            } else {
                $scope.errores = data.errores;
                OfertaEmpleoServi.showAlertError();
            }
            OfertaEmpleoServi.cerrarCargando();
            
        }).catch(function () {
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });
    }
})

.controller('caracterizacionAgenciaCtrl', function ($scope, OfertaEmpleoServi,$state) {
    
    OfertaEmpleoServi.cargando();
    $scope.agencia = { actividades: [], toures: []  };

   
    OfertaEmpleoServi.getinfoCaracterizacionOperadora($state.params.id, $state.params.offline)
    .then(function (data) {
        $scope.actividades = data.actividades;
        $scope.toures = data.toures;
        if (data.retornado != null) {
            $scope.agencia = data.retornado;
            for (var i=0; i<$scope.actividades.length; i++ ) {
                $scope.actividades[i].check =  $scope.agencia.actividades.indexOf($scope.actividades[i].id)!=-1;
            }
        }
        OfertaEmpleoServi.cerrarCargando();
    }).catch(function () {
        OfertaEmpleoServi.cerrarCargando();
        alert("Error");
    })
    

    $scope.validarOtro = function (sw) {
        if (sw == 0) {
            if ($scope.agencia.otraD != '' && $scope.agencia.otraD != null) {
                if ($scope.agencia.actividades.indexOf(11) == -1) {
                    $scope.agencia.actividades.push(11)
                }
            }
        } 
    }

    $scope.guardar = function (carForm) {
       
        if (!carForm.$valid || $scope.agencia.actividades.length == 0 ) {  OfertaEmpleoServi.showAlertError(); return; }
        
        OfertaEmpleoServi.cargando();
        $scope.agencia.id = $state.params.id;
       
        OfertaEmpleoServi.guardarCaracterizacionOperadora( $state.params.id, $scope.agencia, $state.params.offline)
        .then(function (data) {
            if(data.success){
                $state.go( "app.ocupacionAgenciasOperadora" , { id:$scope.agencia.id, offline: $state.params.offline } );
            }else{
               $scope.errores = data.errores;
               OfertaEmpleoServi.showAlertError();
            }
            OfertaEmpleoServi.cerrarCargando(); 
            
        }).catch(function () {
            alert("Error");
            OfertaEmpleoServi.cerrarCargando(); 
        });

    }
   
    $scope.checklist = function(id, check){
        var index = $scope.agencia.actividades.indexOf(id);
        
        if( check==true  && index==-1){ $scope.agencia.actividades.push(id); return true; }
        else if ( check==false  && index!=-1){ $scope.agencia.actividades.splice(index,1); return false;  }
            
    }
    
    
})

