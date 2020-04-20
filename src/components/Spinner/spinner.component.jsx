import React from 'react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './spinner.css'
import { useGlobal } from '../../states/global'

const Spinner = () => {


    const [state,] = useGlobal()
    const visible = state.showSpinner
    return (
        <div className={visible ? 'spinner-container' : 'hidden'}>
            <p>Carregando...</p>
            <Loader
                type="TailSpin"
                color="#2a5b8c"
                height={100}
                width={100}
                className="spinner"
            />
        </div>
    )
}

export default Spinner