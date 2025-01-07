import React from "react";
import css from "./header.module.scss";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PokemonTitle from "../../../assets/pokemon-title.png";

export default function Header({ searchPokemon }) {
  const handleInputChange = (e) => {
    const query = e.target.value;
    searchPokemon(query);
  };

  return (
    <header>
      <nav className={css.header}>
        <div className={css.logo}>
          <img src={PokemonTitle} alt="Pokemon Title" />
        </div>
        <div className={css.menu}>
          <ul>
            <li>
              <a href="/">POKEDEX V1</a>
            </li>
          </ul>
        </div>
        <div>
          <TextField
            id="search"
            label="Buscar Pokémon"
            variant="standard"
            onChange={handleInputChange}
            placeholder="Pokemon..."
            sx={{
              width: "300px",
              padding: "5px",
              margin: "5px",
              backgroundColor: "#4b5563",
              borderRadius: "5px",
              "& .MuiInputBase-root": {
                color: "white", // Texto blanco
              },
              "& .MuiInputLabel-root": {
                color: "white", // Etiqueta blanca
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // Placeholder blanco
              },
              "& .MuiInputAdornment-root": {
                color: "white", // Ícono blanco
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </nav>
    </header>
  );
}
