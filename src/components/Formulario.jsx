import React, {useEffect, useState} from 'react';
import styled from "@emotion/styled";
import useMoneda from '../hooks/useMoneda'
import useCriptomoneda from "../hooks/useCriptomoneda";
import axios from 'axios'
import Error from "./Error";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #ffffff;
  transition: background-color .3s ease;
  
  &:hover{
    background-color: #326ac0;
    cursor: pointer;
  }
`

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //State del listado de criptomonedas
    const [listaCripto, agregarCriptomoneda] = useState([]);
    const [error, guardarError] = useState(false)

    //Arreglo de monedas
    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'},
        {codigo: 'COP', nombre: 'Peso Colombiano'}
    ]

    //Utilizar useMoneda
    const [moneda, SelectMoneda] = useMoneda('Elige tu Moneda', '', MONEDAS);
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Criptomoneda', '', listaCripto)

    //Ejecutar llamado al API
    useEffect(() => {
        const consultaAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=dcea25e8e6188b2511fd7e67ce6da1f5e46491b165e1ce5f5805560813d45ec3';
            const resultado = await axios.get(url);
            agregarCriptomoneda(resultado.data.Data)
        }

        consultaAPI()
    }, [])

    //Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault()

        // Validar si ambos campos estan llenos
        if (moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }

        //Pasar los datos al componente principal
        guardarError(false)
        guardarMoneda(moneda)
        guardarCriptomoneda(criptomoneda)


    }

    return (
        <form onSubmit={cotizarMoneda}>
            {error ? <Error mensaje={'Todos los campos son obligatorios'}/> : null}
            <SelectMoneda/>
            <SelectCripto/>
            <Boton
                type={'submit'}
                value={'Calcular'}
            />

        </form>
    );
};

export default Formulario;