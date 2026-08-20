from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pokemon/{name}")
def get_pokemon(name: str):
    url = f"https://pokeapi.co/api/v2/pokemon/{name.lower().strip()}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Pokemon no encontrado")
    return response.json()

@app.get("/pokemones")
def get_pokemones(limit: int = 20):
    url = f"https://pokeapi.co/api/v2/pokemon?limit={limit}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Error pokeapi")
    
    data = response.json()
    detalles = []
    
    for p in data["results"]:
        res = requests.get(p["url"])
        if res.status_code == 200:
            detalles.append(res.json())
            
    return detalles