angular.module('AppEmpleo', [])

.controller('empleoTrimestralCtrl', ['$scope', 'OfertaEmpleoServi', '$state',function ($scope, OfertaEmpleoServi, $state){
   
    OfertaEmpleoServi.cargando();
    $scope.empleo = {};
    $scope.id = $state.params.id; 

    OfertaEmpleoServi.cargarDatosEmplMensual($scope.id, $state.params.offline)
    .then(function (data) {
            $scope.empleo = data.empleo;
            $scope.tipo_cargo = data.tipo_cargo;
            OfertaEmpleoServi.cerrarCargando();
    }).catch(function () {
         alert("Error");
         OfertaEmpleoServi.cerrarCargando();
    });
   
      
    $scope.guardar = function (form) {
        $scope.empleo.Encuesta = $scope.id;
        if (form.$valid && $scope.validacion()) {
            
            OfertaEmpleoServi.cargando();
            
            OfertaEmpleoServi.guardarEmpleoMensual($scope.id,$scope.empleo, $state.params.offline)
               .then(function (data) {
                
                if (data.success == true) {
                    $state.go( "app.empleadosCaracterizacion" , {id:$scope.id, offline: $state.params.offline} );
                } else {
                    $scope.errores = data.errores;
                }
                OfertaEmpleoServi.cerrarCargando();
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            });
            
            
        } else {
            OfertaEmpleoServi.showAlertError();
        }
    }

    $scope.cargo = function(tipo){
        if($scope.empleo.Sexo){
            for(var i = 0; i < $scope.empleo.Sexo.length ; i ++){
                
                if($scope.empleo.Sexo[i].tipo_cargo_id == tipo ){
                    
                    return $scope.empleo.Sexo[i];
                }
                
            }
            
            var obj = {};
            obj.tipo_cargo_id = tipo;
            obj.hombres = 0;
            obj.mujeres = 0;
            
            $scope.empleo.Sexo.push(obj);
            
            return obj;

        }        
    }

    $scope.Totalcargo = function(){
        if($scope.empleo.Sexo){
            
            var total = 0;
            for(var i = 0; i < $scope.empleo.Sexo.length ; i ++){
                total = total +  $scope.empleo.Sexo[i].hombres  +  $scope.empleo.Sexo[i].mujeres;
            }
                
        }
        else{
            return 0;
        }
        
        return total;    
    }        
    
    $scope.Total = function(item,item2){
        if($scope.empleo[item]){
            
            var    total = 0;
            for(var i = 0; i < $scope.empleo[item].length ; i ++){
                total =  total + ($scope.empleo[item][i][item2] == null ? 0 : ($scope.empleo[item][i][item2] == undefined ? 0 : $scope.empleo[item][i][item2]));
            }
                
        }else{
            return 0;
        }
        
        return total;    
    } 
    
    $scope.totalfila = function(obj,tipo,sexo){
        if(obj){
                for(var i = 0; i < obj.length ; i ++){
                    
                    if(obj[i].tipo_cargo_id == tipo && obj[i].sexo == sexo ){
                        var suma = 0;
                        for (var item in obj[i]) {
                        if(!(item == "id" || item == "sexo" || item == "tipo_cargo_id" || item == "encuestas_id" || item == "encuesta_id"))
                                suma = suma + (obj[i][item] == null ? 0 : (obj[i][item] == undefined ? 0 :obj[i][item]));
                        }
                        return suma;
                    }
                    
                }
        
        }
        
        return 0;
                
    }
    

    $scope.edadempleado = function(tipo,sexo){
        if($scope.empleo.Edad){
            for(var i = 0; i < $scope.empleo.Edad.length ; i ++){
                
                if($scope.empleo.Edad[i].tipo_cargo_id == tipo && $scope.empleo.Edad[i].sexo == sexo ){
                    
                    return $scope.empleo.Edad[i];
                }
                
            }
        
            var obj = {};
            obj.tipo_cargo_id = tipo;
            obj.sexo = sexo == 1 ? true : false ;
    		obj.docea18 = 0;
    		obj.diecinuevea25 = 0;
    		obj.ventiseisa40 = 0;
    		obj.cuarentayunoa64 = 0;
    		obj.mas65 = 0;
            $scope.empleo.Edad.push(obj);
        
            return obj;

        }        
    }

    
    $scope.eduacionempleado = function(tipo,sexo){
        if($scope.empleo.Educacion){
            for(var i = 0; i < $scope.empleo.Educacion.length ; i ++){
                
                if($scope.empleo.Educacion[i].tipo_cargo_id == tipo && $scope.empleo.Educacion[i].sexo == sexo ){
                    
                    return $scope.empleo.Educacion[i];
                }
                
            }
        
            var obj = {};
            obj.tipo_cargo_id = tipo;
            obj.sexo = sexo == 1 ? true : false;
    		obj.ninguno = 0;
    		obj.posgrado = 0;
    		obj.bachiller = 0;
    		obj.universitario = 0;
    		obj.tecnico = 0;
    		obj.tecnologo = 0;
            $scope.empleo.Educacion.push(obj);
            
            return obj;

        }        
    }


    $scope.ingleempleado = function(tipo,sexo){
        if($scope.empleo.ingles){
        for(var i = 0; i < $scope.empleo.ingles.length ; i ++){
            
            if($scope.empleo.ingles[i].tipo_cargo_id == tipo && $scope.empleo.ingles[i].sexo == sexo ){
                
                return $scope.empleo.ingles[i];
            }
            
        }
        
        var obj = {};
        obj.tipo_cargo_id = tipo;
        obj.sexo = sexo == 1 ? true : false ;
        obj.sabeningles = 0;
        $scope.empleo.ingles.push(obj);
        
        return obj;

        }        
    }


    $scope.vinculacionempleado = function(tipo,sexo){
        if($scope.empleo.Vinculacion){
        for(var i = 0; i < $scope.empleo.Vinculacion.length ; i ++){
            
            if($scope.empleo.Vinculacion[i].tipo_cargo_id == tipo && $scope.empleo.Vinculacion[i].sexo == sexo ){
                
                return $scope.empleo.Vinculacion[i];
            }
            
        }
        
        var obj = {};
        obj.sexo = sexo == 1 ? true : false ;
        obj.tipo_cargo_id = tipo;
        obj.sexo = sexo == 1 ? true : false ;
		obj.contrato_direto = 0;
		obj.personal_permanente = 0;
		obj.personal_agencia = 0;
		obj.trabajador_familiar = 0;
		obj.propietario = 0;
		obj.aprendiz = 0;
		obj.cuenta_propia = 0;
        $scope.empleo.Vinculacion.push(obj);
        
        return obj;

        }        
    }


   $scope.tiempoempleado = function(tipo,sexo){
        if($scope.empleo.Empleo){
        for(var i = 0; i < $scope.empleo.Empleo.length ; i ++){
            
            if($scope.empleo.Empleo[i].tipo_cargo_id == tipo && $scope.empleo.Empleo[i].sexo == sexo ){
                
                return $scope.empleo.Empleo[i];
            }
            
        }
        
        var obj = {};
        obj.tipo_cargo_id = tipo;
        obj.sexo = sexo == 1 ? true : false ;
		obj.tiempo_completo = 0;
		obj.medio_tiempo = 0;
        $scope.empleo.Empleo.push(obj);
        
        return obj;

        }        
    }

    $scope.remuneracion = function(tipo,sexo){
        if($scope.empleo.Remuneracion){
        for(var i = 0; i < $scope.empleo.Remuneracion.length ; i ++){
            
            if($scope.empleo.Remuneracion[i].tipo_cargo_id == tipo && $scope.empleo.Remuneracion[i].sexo == sexo ){
                
                return $scope.empleo.Remuneracion[i];
            }
            
        }
        
        obj = {};
        obj.tipo_cargo_id = tipo;
        obj.sexo = sexo == 1 ? true : false ;
		obj.valor = 0;
        $scope.empleo.Remuneracion.push(obj);
        
        return obj;

        }        
    }

    $scope.promedio = function(){
        
        if( $scope.remuneracion(1,1) == null){
            return 0;
        }
        var valor =  ($scope.remuneracion(1,1).valor*$scope.cargo(1).hombres) + ($scope.remuneracion(1,0).valor*$scope.cargo(1).mujeres) + ($scope.remuneracion(2,1).valor*$scope.cargo(2).hombres) + ($scope.remuneracion(2,0).valor*$scope.cargo(2).mujeres) + ($scope.remuneracion(3,1).valor*$scope.cargo(3).hombres) + ($scope.remuneracion(3,0).valor*$scope.cargo(3).mujeres) ; 
        
        var valor2 =  ( $scope.cargo(1).mujeres + $scope.cargo(1).hombres + $scope.cargo(2).mujeres + $scope.cargo(2).hombres + $scope.cargo(3).mujeres + $scope.cargo(3).hombres)
        if (valor2 != 0){ 
        return valor / valor2
        }
        return 0
    }

    $scope.vacantesSi = function(){
        var vacante  = ( $scope.empleo.VacanteOperativo == null ? 0 : ($scope.empleo.VacanteOperativo  == undefined ? 0 :$scope.empleo.VacanteOperativo ));
         var vacante2  = ( $scope.empleo.VacanteAdministrativo == null ? 0 : ($scope.empleo.VacanteAdministrativo  == undefined ? 0 :$scope.empleo.VacanteAdministrativo ));
        var vacante3  = ( $scope.empleo.VacanteGerencial == null ? 0 : ($scope.empleo.VacanteGerencial  == undefined ? 0 :$scope.empleo.VacanteGerencial ));
       
        
        if((  vacante +  vacante2  + vacante3   ) > 0){
        return true;
        }else{
            if($scope.empleo != null){
                $scope.empleo.Razon = {};
                $scope.empleo.Razon.apertura = 0;
                $scope.empleo.Razon.crecimiento = 0;
                $scope.empleo.Razon.remplazo = 0;
            }
            return false;
        }
    }
    
     $scope.validacion = function(){
        return true;
    }
    
        
   

}])

.controller('empleoCaracterizacionCtrl',  ['$scope', 'OfertaEmpleoServi', '$state',function ($scope, OfertaEmpleoServi,$state) {
   
    OfertaEmpleoServi.cargando();
    $scope.empleo = {};
    $scope.id = $state.params.id; 
    
     OfertaEmpleoServi.cargarDatosEmplCaract($scope.id, $state.params.offline)
     .then(function (data) {
             
            $scope.empleo = data.empleo;
            $scope.data = data.data;
            OfertaEmpleoServi.cerrarCargando();
            
    }).catch(function () {
         alert("Error");
         OfertaEmpleoServi.cerrarCargando();
    });

    $scope.agregar = function(){
        
        var obj = {};
        obj.realizada_empresa = 0;
        $scope.empleo.tematicas.push(obj);
    }
    
    $scope.quitar = function(obj){
        $scope.empleo.tematicas.splice($scope.empleo.tematicas.indexOf(obj),1);
    }
    
   $scope.existeOpcion = function(obj){
        
       for (var i = 0; i < $scope.empleo.medios.length; i++) {
            if($scope.empleo.medios[i] == obj){
                return true;
            }
        }
        return false;
    }
    
   $scope.existeTipo = function(obj){
        
       for (var i = 0; i < $scope.empleo.tipos.length; i++) {
            if($scope.empleo.tipos[i] == obj){
                return true;
            }
        }
        return false;
    }
    
    
   $scope.validar = function(){
        
        
        if($scope.empleo.capacitacion == 1 && $scope.empleo.tematicas.length == 0){
            
            return true;
        }
        
    
    }
    
    
    $scope.guardar = function (form) {
        
        $scope.empleo.Encuesta = $scope.id;
        
        if (form.$valid || $scope.validar()) {
            
            OfertaEmpleoServi.cargando();
            
            OfertaEmpleoServi.guardarEmpCaracterizacion($scope.id,$scope.empleo, $state.params.offline)
                .then(function (data) {
               
                if (data.success == true) {
                    $state.go( "app.listadoEncuestasSinLLenar" , { id: data.idsitio, offline: $state.params.offline } );
                } else {
                    $scope.errores = data.errores;
                    OfertaEmpleoServi.showAlertError();
                }
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            })
        } else {
            OfertaEmpleoServi.showAlertError();
        }
    }
}])

.controller('empleoMensualCtrl', ['$scope', 'OfertaEmpleoServi', '$state',function ($scope, OfertaEmpleoServi,$state){
    
    OfertaEmpleoServi.cargando();
    $scope.empleo = {};
    $scope.id = $state.params.id; 

     OfertaEmpleoServi.cargarDatosEmpleo($scope.id, $state.params.offline)
     .then(function (data) {
            $scope.empleo = data.empleo;
            OfertaEmpleoServi.cerrarCargando();
    }).catch(function () {
        alert("Error");
        OfertaEmpleoServi.cerrarCargando();
    });
       

    $scope.cargo = function(tipo){
        if($scope.empleo.Sexo){
        for(i = 0; i < $scope.empleo.Sexo.length ; i ++){
            
            if($scope.empleo.Sexo[i].tipo_cargo_id == tipo ){
                
                return $scope.empleo.Sexo[i];
            }
            
        }
        
        obj = {};
        obj.tipo_cargo_id = tipo;
        obj.hombres = 0;
        obj.mujeres = 0;
        
        $scope.empleo.Sexo.push(obj);
        
        return obj;

        }        
    }

    $scope.validacion = function(){
        
        
        return true;
    }
    
        
    $scope.guardar = function (empleoForm) {
        $scope.empleo.Encuesta = $scope.id;
        if (empleoForm.$valid && $scope.validacion()) {
            
            OfertaEmpleoServi.cargando();
            
            OfertaEmpleoServi.guardarempleo($scope.id,$scope.empleo, $state.params.offline)
            .then(function (data) {
                
                if (data.success == true) {
                    $state.go( "app.listadoEncuestasSinLLenar" , { id: data.sitio, offline: $state.params.offline } );
                } else {
                    $scope.errores = data.errores;
                }
                OfertaEmpleoServi.cerrarCargando();
            }).catch(function () {
                alert("Error");
                OfertaEmpleoServi.cerrarCargando();
            })
            
            
        } else {
            OfertaEmpleoServi.showAlertError();
        }
    }

}])