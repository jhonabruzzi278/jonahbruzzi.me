import React from "react";
// internal
import { Dots, Lists } from "@svg/index";
import NiceSelect from "@ui/NiceSelect";

export function ShowingResult({ show, total }) {
  return (
    <div className="shop__result">
      <p>Mostrando 1–{show} de {total} resultados</p>
    </div>
  );
}

export function ShopShortTab({ handleTab }) {
  return (
    <div className="shop__sort-item">
      <div className="shop__sort-tab tp-tab">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              onClick={() => handleTab('grid')}
              className="nav-link active"
              id="nav-grid-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-grid"
              type="button"
              role="tab"
              aria-controls="nav-grid"
              aria-selected="true"
              tabIndex='-1'
            >
              <Dots />
            </button>
            <button
              onClick={() => handleTab('lists')}
              className="nav-link"
              id="nav-list-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-list"
              type="button"
              role="tab"
              aria-controls="nav-list"
              aria-selected="false"
              tabIndex='-1'
            >
              <Lists />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export function ShopShortSelect({shortHandler}) {
  return (
    <div className="shop__sort-item">
      <div className="shop__sort-select">
        <NiceSelect
          options={[
            { value: "Filtro rápido", text: "Filtro rápido" },
            { value: "Producto más reciente", text: "Producto más reciente" },
            { value: "Precio menor a mayor", text: "Precio menor a mayor" },
            { value: "Precio mayor a menor", text: "Precio mayor a menor" },
          ]}
          defaultCurrent={0}
          onChange={shortHandler}
          name="Ordenar por más reciente"
        />
      </div>
    </div>
  );
}
