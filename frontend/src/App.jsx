import { useState } from 'react'
import { useFetch } from './hooks/useFetch'

function App() {
  const { data: pokemones, loading, error } = useFetch(20);
  const [busqueda, setBusqueda] = useState('');
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState(null);
  
  const [isShiny, setIsShiny] = useState(false);

  const ejecutarBusqueda = async () => {
    if (busqueda.trim() === '') {
      setPokemonSeleccionado(null);
      setErrorBusqueda(null);
      return;
    }
    try {
      setErrorBusqueda(null);
      const respuesta = await fetch(`http://localhost:8000/pokemon/${busqueda.toLowerCase().trim()}`);
      if (!respuesta.ok) throw new Error("Pokémon no encontrado");
      const data = await respuesta.json();
      setPokemonSeleccionado(data);
      setIsShiny(false); 
    } catch (err) {
      setErrorBusqueda(err.message);
      setPokemonSeleccionado(null);
    }
  };

  return (
    <div className="pokedex-app">
      <h1>Consumo de la Poke Api</h1>
      
      <div className="busqueda">
        <input 
          type="text" 
          placeholder="Buscar por nombre o ID..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda()}
        />
        <button onClick={ejecutarBusqueda}>Buscar</button>
      </div>

      <div id="resultado">
        {error && <p className="error">Error {error}</p>}
        {errorBusqueda && <p className="error">Error {errorBusqueda}</p>}
        {loading && <p className="cargando">Primera Generacion</p>}

        {pokemonSeleccionado ? (
          <div className="tarjeta destacada">
             <img 
                src={isShiny 
                  ? pokemonSeleccionado.sprites.front_shiny 
                  : (pokemonSeleccionado.sprites.other['official-artwork'].front_default || pokemonSeleccionado.sprites.front_default)
                } 
                alt={pokemonSeleccionado.name} 
             />
             
             <button className="btn-shiny" onClick={() => setIsShiny(!isShiny)}>
               {isShiny ? 'Ver Normal' : 'Ver Shiny'}
             </button>

             <h2>#{pokemonSeleccionado.id} {pokemonSeleccionado.name}</h2>
             <p className="tipo-poke"><strong>Tipo:</strong> {pokemonSeleccionado.types.map(t => t.type.name).join(', ')}</p>
             
             <div className="stats-container">
                {pokemonSeleccionado.stats.slice(0, 3).map((s) => (
                  <div key={s.stat.name} className="stat-row">
                    <span className="stat-name">{s.stat.name.toUpperCase()}</span>
                    <span className="stat-value">{s.base_stat}</span>
                    <div className="stat-bar">
                      <div className="stat-fill" style={{ width: `${(s.base_stat / 255) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>

             <button className="btn-volver" onClick={() => { setPokemonSeleccionado(null); setBusqueda(''); }}>Lista Primera Generacion</button>
          </div>
        ) : (
          !loading && !error && (
            <div className="grid-pokemones">
              {pokemones.map((poke) => (
                <div key={poke.id} className="tarjeta">
                  <img src={poke.sprites.front_default} alt={poke.name} />
                  <h2>#{poke.id} {poke.name}</h2>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default App