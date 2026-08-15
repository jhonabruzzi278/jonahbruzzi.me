'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
// internal
import { Email, EyeCut, Lock, UserTwo } from "@svg/index";
import ErrorMessage from "@components/error-message/error";
import { useRegisterUserMutation } from "src/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@utils/toast";
import { useRouter } from "next/navigation";


const schema = Yup.object().shape({
  name: Yup.string().required().label("Nombre"),
  email: Yup.string().required().email().label("Correo electrónico"),
  password: Yup.string().required().min(6).label("Contraseña"),
  confirmPassword: Yup.string()
     .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
});


const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [registerUser, {}] = useRegisterUserMutation();
  const router = useRouter();
  // react hook form
  const { register, handleSubmit, formState:{ errors },reset } = useForm({
    resolver: yupResolver(schema)
  });
  // on submit
  const onSubmit = (data) => {
    const [firstName, ...rest] = data.name.trim().split(" ");
    registerUser({
      email: data.email,
      password: data.password,
      firstName,
      lastName: rest.join(" "),
    }).then((result) => {
      if(result?.error){
        notifyError(result?.error?.data?.message || 'No se pudo crear la cuenta');
      }
      else {
        notifySuccess("Cuenta creada correctamente");
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    })
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login__input-wrapper">
        <div className="login__input-item">
          <div className="login__input">
            <input
              {...register("name",{required:`El nombre es obligatorio`})}
              name="name"
              type="text"
              placeholder="Ingresa tu nombre"
              id="name"
            />
            <span>
              <UserTwo />
            </span>
          </div>
           <ErrorMessage message={errors.name?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input">
            <input
             {...register("email",{required:`El correo electrónico es obligatorio`})}
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              id="email"
            />
            <span>
              <Email />
            </span>
          </div>
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input-item-inner p-relative">
            <div className="login__input">
              <input
                {...register("password",{required:`La contraseña es obligatoria`})}
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Contraseña"
                id="password"
              />
              <span>
                <Lock />
              </span>
            </div>
            <span
              className="login-input-eye"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <i className="fa-regular fa-eye"></i> : <EyeCut />}
            </span>
          </div>
          <ErrorMessage message={errors.password?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input-item-inner p-relative">
            <div className="login__input">
              <input
               {...register("confirmPassword")}
                name="confirmPassword"
                type={showConPass ? "text" : "password"}
                placeholder="Confirmar contraseña"
                id="confirmPassword"
              />
              <span>
                <Lock />
              </span>
            </div>
            <span
              className="login-input-eye"
              onClick={() => setShowConPass(!showConPass)}
            >
              {showConPass ? <i className="fa-regular fa-eye"></i> : <EyeCut />}
            </span>
          </div>
          <ErrorMessage message={errors.confirmPassword?.message} />
        </div>
      </div>


      <div className="login__btn mt-25">
        <button type="submit" className="tp-btn w-100">
          Crear cuenta
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
