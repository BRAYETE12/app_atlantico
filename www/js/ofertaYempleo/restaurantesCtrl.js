var situr = angular.module("restauranteApp", []);

situr.controller('caracterizacionAlimentosCtrl', ['$scope','OfertaEmpleoServi', '$state', function ($scope,OfertaEmpleoServi,$state) {

    OfertaEmpleoServi.cargando();
    $scope.alimentos = {}
    
    OfertaEmpleoServi.getInfoAlimentosC( $state.params.id, $state.params.offline )
    .then(function (dato) {
        $scope.actividades_servicios = dato.actividades_servicios;
        $scope.especialidades = dato.especialidades;
        if (dato.provision != null) {
            $scope.alimentos = dato.provision;
        }
        
        OfertaEmpleoServi.cerrarCargando();
        
    }).catch(function () { 
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });
    
    $scope.guardar = function (carAlim) {
        
        if (!carAlim.$valid) { return; }

        OfertaEmpleoServi.cargando();
        $scope.alimentos.id = $state.params.id;
        
        OfertaEmpleoServi.GuardarCarAlimentos( $state.params.id, $scope.alimentos, $state.params.offline)
        .then(function (data) {
           
            if (data.success) {
                $state.go( "app.capacidadAlimentos" , { id:$state.params.id, offline: $state.params.offline } );
            } else {
                $scope.errores = data.errores
            }
            OfertaEmpleoServi.cerrarCargando();
            
        }).catch(function () {
            alert("Error");
            OfertaEmpleoServi.cerrarCargando();
        });

    }

}]);


situr.controller('capacidadAlimentosCtrl', ['$scope','OfertaEmpleoServi', '$state', function ($scope,OfertaEmpleoServi, $state) {
    
    OfertaEmpleoServi.cargando();
    $scope.alimentos = {}
    $scope.id = $state.params.id;

    OfertaEmpleoServi.getInfoCapAlimentos( $scope.id, $state.params.offline )
    .then(function (data) {
        if (data.capacidad != null) {
            $scope.alimentos = data.capacidad;
        }
        OfertaEmpleoServi.cerrarCargando();
        
    }).catch(function () {
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });
        
    
    $scope.guardar = function (capacidadForm) {
        if (!capacidadForm.$valid) {  return; }

        $scope.alimentos.id = $state.params.id;
        OfertaEmpleoServi.cargando();
        
        OfertaEmpleoServi.GuardarOfertaAlimentos( $state.params.id, $scope.alimentos, $state.params.offline)
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

    }
}])