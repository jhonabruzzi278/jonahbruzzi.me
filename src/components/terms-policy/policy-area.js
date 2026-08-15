
const PolicyArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">Fecha de vigencia: 25 de mayo de 2023</h4>
                <p>
                  En Jonahbruzzi sabemos que te preocupa cómo se usa y comparte
                  tu información personal, y nos tomamos tu privacidad en
                  serio. Lee lo siguiente para conocer más sobre la Política
                  de Privacidad (“Política de Privacidad”) de Jonahbruzzi.
                  Esta Política de Privacidad también te informa sobre tus
                  derechos y opciones respecto a tu Información Personal, y
                  cómo puedes contactarnos para actualizar tu información de
                  contacto u obtener respuestas a preguntas que puedas tener
                  sobre nuestras prácticas de privacidad.
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
                <h3 className="policy__title">Recopilación de información</h3>
                <p>
                  Puedes visitar y disfrutar de nuestro sitio web sin revelar
                  ninguna Información Personal sobre ti. Sin embargo, para que
                  el Servicio funcione correctamente necesitaremos que
                  compartas con nosotros cierta Información Personal.
                </p>

                <p>
                  Para los efectos de esta Política de Privacidad,
                  “Información Personal” significa información que
                  identifica, se relaciona con, describe, es razonablemente
                  capaz de asociarse con, o podría razonablemente vincularse,
                  directa o indirectamente, con un consumidor, dispositivo u
                  hogar en particular. No incluye información desidentificada
                  o agregada, ni información pública disponible legalmente en
                  registros gubernamentales.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">Uso de la información personal</h3>
                <ul>
                  <li>Para proporcionar y mantener el Servicio;</li>
                  <li>Para detectar, prevenir y resolver problemas técnicos;</li>
                  <li>
                    Para registrarte como usuario y proporcionarte los
                    servicios que requieras;
                  </li>
                  <li>
                    Para decidir si ofrecerte un producto o servicio de
                    Jonahbruzzi;
                  </li>
                  <li>Para notificarte sobre cambios en nuestro Servicio;</li>
                  <li>Para brindarte atención y soporte al cliente;</li>
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

export default PolicyArea;
