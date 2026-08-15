import React from "react";

const PrdDetailsAdditional = () => {
  return (
    <div className="product__details-additional">
      <div className="row">
        <div className="col-xl-9">
          <div className="product__details-additional-inner">
            <table>
              <tbody>
                <tr>
                  <th scope="row">Marca:</th>
                  <td>Apple</td>
                </tr>
                <tr>
                  <th scope="row">Modelo:</th>
                  <td>GPS</td>
                </tr>
                <tr>
                  <th scope="row">Tamaño de pantalla:</th>
                  <td>41 milímetros</td>
                </tr>
                <tr>
                  <th scope="row">Color:</th>
                  <td>Caja de aluminio verde con correa deportiva Clover</td>
                </tr>
                <tr>
                  <th scope="row">Dispositivos compatibles:</th>
                  <td>Smartphone</td>
                </tr>
                <tr>
                  <th scope="row">Característica especial:</th>
                  <td>
                    Monitor de actividad, monitor de ritmo cardíaco, monitor de
                    sueño, oxígeno en sangre
                  </td>
                </tr>
                <tr>
                  <th scope="row">Capacidad:</th>
                  <td>32GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrdDetailsAdditional;
