import Link from "next/link";

const TermsArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">
                  Última actualización: 18 de septiembre de 2022
                </h4>
                <p>
                  Estos son los Términos y Condiciones que rigen el uso de
                  este Servicio y el acuerdo que opera entre Tú y la Empresa.
                  Estos Términos y Condiciones establecen los derechos y
                  obligaciones de todos los usuarios respecto al uso del
                  Servicio. Tu acceso y uso del Servicio está condicionado a
                  tu aceptación y cumplimiento de estos Términos y
                  Condiciones. Estos Términos y Condiciones se aplican a
                  todos los visitantes, usuarios y demás personas que
                  accedan o utilicen el Servicio.
                </p>
                <p>
                  Al usar o acceder a los Servicios de cualquier manera,
                  reconoces que aceptas las prácticas y políticas descritas en
                  esta Política de Privacidad, y por este medio consientes que
                  Jonahbruzzi recopilará, usará y compartirá tu información de
                  las siguientes maneras. Recuerda que tu uso de los Servicios
                  está en todo momento sujeto a los Términos establecidos en
                  https://jonahbruzzi.me/legal/terms, los cuales incorporan
                  esta Política de Privacidad. Cualquier término que
                  Jonahbruzzi use en esta Política de Privacidad sin
                  definirlo tiene el significado que se le da en los
                  Términos.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Definiciones</h3>
                <p>
                  Las palabras cuya letra inicial está en mayúscula tienen
                  significados definidos bajo las siguientes condiciones. Las
                  siguientes definiciones tendrán el mismo significado sin
                  importar si aparecen en singular o en plural.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">
                  Propósitos de estos Términos y Condiciones:
                </h3>
                <ul>
                  <li>
                    <strong>Afiliada</strong> significa una entidad que
                    controla, es controlada por, o está bajo control común
                    con una parte, donde &quot;control&quot; significa la
                    propiedad del 50% o más de las acciones, participación
                    accionaria u otros valores con derecho a voto para la
                    elección de directores u otra autoridad administrativa.
                  </li>
                  <li>
                    <strong>País</strong> se refiere a: California, Estados
                    Unidos
                  </li>
                  <li>
                    <strong>Empresa</strong> (referida como &quot;la
                    Empresa&quot;, &quot;Nosotros&quot; o &quot;Nuestro&quot;
                    en este Acuerdo) se refiere a Jonahbruzzi.
                  </li>
                  <li>
                    <strong>Dispositivo</strong> significa cualquier
                    dispositivo que pueda acceder al Servicio, como un
                    computador, un celular o una tablet digital.
                  </li>
                  <li>
                    <strong>Servicio</strong> se refiere al sitio web.
                  </li>
                  <li>
                    <strong>Sitio web</strong> se refiere a Jonahbruzzi,
                    accesible desde{" "}
                    <Link
                      href="/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      jonahbruzzi.me
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="policy__contact">
                <h3 className="policy__title policy__title-2">Contáctanos</h3>
                <p>Puedes contactarnos en cualquier momento a través de:</p>

                <ul>
                  <li>
                    Correo electrónico:{" "}
                    <span>
                      <a href="mailto:contacto@jonahbruzzi.me">contacto@jonahbruzzi.me</a>
                    </span>
                  </li>
                </ul>

                <div className="policy__address">
                  <p>
                    <a
                      rel="noreferrer"
                      href="https://www.google.com/maps"
                      target="_blank"
                    >
                      Jonahbruzzi SpA <br /> Santiago, Chile
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsArea;
