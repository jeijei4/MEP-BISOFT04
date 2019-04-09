'use strict';

const express = require('express');
const router= express.Router();
const lista_rubros_api = require('./listaEvaluacionMEP.api');


router.route('/agregar_Rubros')
        .post(
            function(req, res)
            {
             lista_rubros_api.agregar_Rubros(req, res);
            }
        );

        module.exports = router;