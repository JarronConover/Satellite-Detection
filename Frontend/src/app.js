import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>React + Flask Integration</h1>
            {data ? <p>{data.message}</p> : <p>Loading...</p>}
        </div>
    );
}

export default App;