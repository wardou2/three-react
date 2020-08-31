import React, {useEffect} from 'react';
import './App.css';
import {RENDERER} from './3D/main'

function App() {

    useEffect(() => {
        new RENDERER()
    }, [])

    return (
        <div id="canavs-id"> </div>
    );
}

export default App;
