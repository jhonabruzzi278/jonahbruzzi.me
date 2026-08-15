'use client';
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import { EmailTwo, Location, MobileTwo, UserTwo } from "@svg/index";
import { useUpdateProfileMutation } from "src/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@utils/toast";
import ErrorMessage from "@components/error-message/error";

// yup  schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Nombre"),
  email: Yup.string().required().email().label("Correo electrónico"),
  phone: Yup.string().label("Teléfono"),
  address: Yup.string().label("Dirección"),
});

const UpdateUser = () => {
  const { user } = useSelector((state) => state.auth);

  const [updateProfile, {}] = useUpdateProfileMutation();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    const [firstName, ...rest] = data.name.trim().split(" ");
    updateProfile({
      firstName,
      lastName: rest.join(" "),
      email: data.email,
      phone: data.phone,
      address: data.address,
    }).then((result) => {
      if(result?.error){
        notifyError(result?.error?.data?.message || "No se pudo actualizar el perfil");
      }
      else {
        notifySuccess("Perfil actualizado correctamente");
      }
    })
  };

  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Datos personales</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("name", { required: `El nombre es obligatorio` })}
                    type="text"
                    placeholder="Ingresa tu nombre de usuario"
                    defaultValue={user?.name}
                  />
                  <span>
                    <UserTwo />
                  </span>
                  <ErrorMessage message={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("email", { required: `El correo electrónico es obligatorio` })}
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    defaultValue={user?.email}
                  />
                  <span>
                    <EmailTwo />
                  </span>
                  <ErrorMessage message={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="Ingresa tu número de teléfono"
                  />
                  <span>
                    <MobileTwo />
                  </span>
                  <ErrorMessage message={errors.phone?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("address")}
                    type="text"
                    placeholder="Ingresa tu dirección"
                  />
                  <span>
                    <Location />
                  </span>
                  <ErrorMessage message={errors.address?.message} />
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">
                  Actualizar perfil
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
