import React, { useEffect, useState } from "react";
import css from "./card.module.scss";
import axios from "axios";
import {
  URL_Pokemon,
  URL_PokemonEvolution,
  URL_PokemonSpecies,
} from "../../../api/apiRest";

export default function Card({ card }) {
  const [pokemon, setPokemon] = useState([]);
  const [especie, setEspecie] = useState([]);
  const [evoluciones, setEvoluciones] = useState([]);

  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_Pokemon}/${card.name}`);

      setPokemon(api.data);
    };

    dataPokemon();
  }, [card]);

  useEffect(() => {
    const especiePokemon = async () => {
      const URL = card.url.split("/");
      const api = await axios.get(`${URL_PokemonSpecies}/${URL[6]}`);
      setEspecie({ url_especie: api?.data?.evolution_chain, data: api?.data });
    };
    especiePokemon();
  }, [card]);

  useEffect(() => {
    async function getPokemonImg(id) {
      const res = await axios.get(`${URL_Pokemon}/${id}`);
      return res?.data?.sprites?.other["official-artwork"]?.front_default;
    }

    if (especie?.url_especie) {
      const obtenerEvoluciones = async () => {
        const arrayEvoluciones = [];
        const URL = especie?.url_especie?.url.split("/");
        const api = await axios.get(`${URL_PokemonEvolution}/${URL[6]}`);
        const URL2 = api?.data?.chain?.species?.url.split("/");
        const img1 = await getPokemonImg(URL2[6]);
        arrayEvoluciones.push({
          img: img1,
          name: api?.data?.chain?.species?.name,
        });

        if (api?.data?.chain?.evolves_to?.length != 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2?.url?.split("/");
          const img2 = await getPokemonImg(ID[6]);
          arrayEvoluciones.push({
            img: img2,
            name: DATA2?.name,
          });

          if (api?.data?.chain?.evolves_to[0]?.evolves_to?.length != 0) {
            const DATA3 =
              api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
            const ID = DATA3?.url?.split("/");
            const img3 = await getPokemonImg(ID[6]);
            arrayEvoluciones.push({
              img: img3,
              name: DATA3?.name,
            });
          }
        }
        setEvoluciones(arrayEvoluciones);
      };
      obtenerEvoluciones();
    }
  }, [especie]);

  let pokeId = pokemon?.id?.toString();
  if (pokeId?.length === 1) {
    pokeId = `00${pokeId}`;
  } else if (pokeId?.length === 2) {
    pokeId = `0${pokeId}`;
  }

  return (
    <div className={css.card}>
      <img
        className={css.img_poke}
        src={pokemon?.sprites?.other["official-artwork"].front_default}
        alt={pokemon.name}
      />
      <div className={`bg-${especie?.data?.color?.name} ${css.sub_card}`}>
        <strong className={css.id_card}>{pokeId}</strong>
        <h2 className={css.name_card}>{pokemon.name}</h2>
        <p className={css.altura_poke}>Altura {pokemon.height} cm</p>
        <p className={css.peso_poke}>Peso {pokemon.weight} kg</p>
        <p className={css.habitat_poke}>
          Habitat {especie?.data?.habitat?.name}
        </p>

        <div className={css.stats_poke}>
          {pokemon?.stats?.map((item, index) => (
            <h6 key={index} className={css.stats}>
              <span className={css.stats_name}>{item.stat.name}</span>
              <progress value={item.base_stat} max={110}></progress>
              <span className={css.stats_number}>{item.base_stat}</span>
            </h6>
          ))}
        </div>

        <div className={css.types_poke}>
          {pokemon?.types?.map((item, index) => (
            <h6 key={index} className={`color-${item.type.name} ${css.types}`}>
              {item.type.name}
            </h6>
          ))}
        </div>

        <div className={css.evoluciones_poke}>
          {evoluciones.map((e) => {
            return (
              <div key={e.name} className={css.evoluciones}>
                <img src={e.img} alt={e.name} className={css.evoluciones_img} />
                <h6>{e.name}</h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
