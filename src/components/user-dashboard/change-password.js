'use client';
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import { useChangePasswordMutation } from "src/redux/features/auth/authApi";
import ErrorMessage from "@components/error-message/error";
import { notifyError, notifySuccess } from "@utils/toast";

const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Correo electrónico"),
  password: Yup.string().required().min(6).label("Contraseña"),
  newPassword: Yup.string().required().min(6).label("Nueva contraseña"),
  confirmPassword: Yup.string()
     .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
});

const ChangePassword = () => {
  const { user } = useSelector((state) => state.auth);
  const [changePassword, {}] = useChangePasswordMutation();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // on submit
  const onSubmit = (data) => {
    changePassword({
      email: user?.email,
      password: data.password,
      newPassword: data.newPassword,
    }).then((result) => {
      if (result?.error) {
        notifyError(result?.error?.data?.message || "No se pudo cambiar la contraseña")
      }
      else {
        notifySuccess("Contraseña actualizada correctamente")
      }
    });
    reset();
  };
  return (
    <div className="profile__password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-xxl-12">
            <div className="profile__input-box">
              <h4>Correo electrónico</h4>
              <div className="profile__input">
                <input
                  {...register("email", { required: `El correo electrónico es obligatorio` })}
                  type="email"
                  defaultValue={user?.email}
                  placeholder="Ingresa tu correo electrónico"
                />
                <ErrorMessage message={errors.email?.message} />
              </div>
            </div>
          </div>
          <div className="col-xxl-12">
            <div className="profile__input-box">
              <h4>Contraseña actual</h4>
              <div className="profile__input">
                <input
                  {...register("password", {
                    required: `La contraseña es obligatoria`,
                  })}
                  type="text"
                  placeholder="Ingresa tu contraseña actual"
                />
                <ErrorMessage message={errors.password?.message} />
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="profile__input-box">
              <h4>Nueva contraseña</h4>
              <div className="profile__input">
                <input
                  {...register("newPassword", {
                    required: `La nueva contraseña es obligatoria`,
                  })}
                  type="text"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <ErrorMessage message={errors.password?.newPassword} />
              </div>
            </div>
          </div>
          {/* confirm password */}
          <div className="col-xxl-6 col-md-6">
            <div className="profile__input-box">
              <h4>Confirmar contraseña</h4>
              <div className="profile__input">
                <input
                  {...register("confirmPassword")}
                  type="text"
                  placeholder="Confirma tu contraseña"
                />
                <ErrorMessage message={errors.confirmPassword?.message} />
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="profile__btn">
              <button type="submit" className="tp-btn-3">
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
