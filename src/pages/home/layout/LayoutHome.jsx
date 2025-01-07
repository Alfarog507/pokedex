import React from "react";
import css from "./layout.module.scss";
import Header from "../header/Header";
import axios from "axios";
import * as icons from "react-icons/fa";
import { useEffect, useState } from "react";
import { URL_Pokemon } from "../../../api/apiRest";
import Card from "../card/Card";

export default function LayoutHome() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [GlobalPokemon, setGlobalPokemon] = useState([]);
  const [xpage, setXpage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Búsqueda actual

  const PAGE_SIZE = 15; // Número de Pokémon por página

  // Carga inicial de todos los Pokémon
  useEffect(() => {
    const getGlobal = async () => {
      const res = await axios.get(`${URL_Pokemon}?offset=0&limit=1000`);
      const data = res.data.results.map((pokemon) => ({
        name: pokemon.name.toLowerCase(),
        url: pokemon.url,
      }));
      setGlobalPokemon(data);
      setPokemon(data.slice(0, PAGE_SIZE)); // Muestra los primeros 15 Pokémon
      setLoading(false);
    };

    getGlobal();
  }, []);

  // Actualiza la lista de Pokémon mostrados al cambiar de página o realizar una búsqueda
  useEffect(() => {
    if (searchQuery) {
      // Si hay una búsqueda activa, no aplica paginación
      const filtered = GlobalPokemon.filter((pokemon) =>
        pokemon.name.includes(searchQuery.toLowerCase())
      );
      setPokemon(filtered);
    } else {
      // Si no hay búsqueda, aplica paginación normal
      const startIndex = (xpage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      setPokemon(GlobalPokemon.slice(startIndex, endIndex));
    }
  }, [xpage, searchQuery, GlobalPokemon]);

  const searchPokemon = (query) => {
    setSearchQuery(query);
    setXpage(1); // Resetea a la primera página al realizar una nueva búsqueda
  };

  return (
    <div className={css.layout}>
      <Header searchPokemon={searchPokemon} />

      <section className={css.section}>
        <div className={css.section_title}>
          <button
            className={css.section_left}
            onClick={() => {
              if (xpage > 1) setXpage(xpage - 1);
            }}
            disabled={xpage === 1} // Deshabilita el botón si estás en la primera página
            aria-label="Página anterior"
          >
            <icons.FaAngleLeft />
          </button>
          <span className={css.section_item}>{xpage}</span>
          <span className={css.section_item}> DE </span>
          <span className={css.section_item}>
            {Math.ceil(GlobalPokemon.length / PAGE_SIZE)}
          </span>
          <button
            className={css.section_right}
            onClick={() => {
              if (xpage < Math.ceil(GlobalPokemon.length / PAGE_SIZE)) {
                setXpage(xpage + 1);
              }
            }}
            disabled={xpage >= Math.ceil(GlobalPokemon.length / PAGE_SIZE)} // Deshabilita si estás en la última página
            aria-label="Página siguiente"
          >
            <icons.FaAngleRight />
          </button>
        </div>
      </section>

      <div className={css.card_content}>
        {loading ? (
          <p>Cargando Pokémon...</p>
        ) : pokemon.length > 0 ? (
          pokemon.map((item, index) => <Card key={index} card={item} />)
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}
