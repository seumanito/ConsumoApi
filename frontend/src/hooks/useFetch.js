import { useState, useEffect } from 'react';

export function useFetch(limite = 20) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarPokemones = async () => {
            try {
                setLoading(true);
                const respuesta = await fetch(`http://localhost:8000/pokemones?limit=${limite}`);
                if (!respuesta.ok) throw new Error("Error al conectar con el servidor");
                const detalles = await respuesta.json();
                setData(detalles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarPokemones();
    }, [limite]);

    return { data, loading, error };
}