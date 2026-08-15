import ErrorMessage from "@components/error-message/error";
import React from "react";
import { useSelector } from "react-redux";
// internal
import { CHILE_REGIONS } from "@hooks/use-checkout-submit";

const BillingDetails = ({ register, errors }) => {
  const { user } = useSelector((state) => state.auth);
  // checkout form list
  function CheckoutFormList({
    col,
    label,
    type = "text",
    placeholder,
    isRequired = true,
    name,
    register,
    error,
    defaultValue,
  }) {
    return (
      <div className={`col-md-${col}`}>
        <div className="checkout-form-list">
          {label && (
            <label>
              {label} {isRequired && <span className="required">*</span>}
            </label>
          )}
          <input
            {...register(`${name}`, {
              required: `${label} es requerido!`,
            })}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue ? defaultValue : ""}
          />
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <CheckoutFormList
          name="firstName"
          col="12"
          label="Nombre"
          placeholder="Nombre"
          register={register}
          error={errors?.firstName?.message}
          defaultValue={user?.name}
        />
        <CheckoutFormList
          name="lastName"
          col="12"
          label="Apellido"
          placeholder="Apellido"
          register={register}
          error={errors?.lastName?.message}
        />
        <CheckoutFormList
          name="address"
          col="12"
          label="Dirección"
          placeholder="Calle y número"
          register={register}
          error={errors?.address?.message}
        />
        <CheckoutFormList
          col="6"
          label="Ciudad / Comuna"
          placeholder="Ciudad / Comuna"
          name="city"
          register={register}
          error={errors?.city?.message}
        />
        <div className="col-md-6">
          <div className="checkout-form-list">
            <label>
              Región <span className="required">*</span>
            </label>
            <select
              {...register("region", { required: "Región es requerida!" })}
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona tu región
              </option>
              {CHILE_REGIONS.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            {errors?.region?.message && (
              <ErrorMessage message={errors.region.message} />
            )}
          </div>
        </div>
        <CheckoutFormList
          col="6"
          label="Código Postal"
          placeholder="Código Postal"
          name="zipCode"
          isRequired={false}
          register={register}
          error={errors?.zipCode?.message}
        />
        <CheckoutFormList
          col="6"
          type="email"
          label="Correo Electrónico"
          placeholder="Tu correo"
          name="email"
          register={register}
          error={errors?.email?.message}
          defaultValue={user?.email}
        />
        <CheckoutFormList
          name="contact"
          col="6"
          label="Teléfono"
          placeholder="Número de teléfono"
          register={register}
          error={errors?.contact?.message}
        />

        <div className="order-notes">
          <div className="checkout-form-list">
            <label>Notas del pedido</label>
            <textarea
              {...register("orderNotes")}
              id="checkout-mess"
              cols="30"
              rows="10"
              placeholder="Notas sobre tu pedido, ej. indicaciones para la entrega."
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingDetails;
