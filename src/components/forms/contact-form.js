'use client';
import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
// internal
import ErrorMessage from "@components/error-message/error";

const schema = Yup.object().shape({
  name: Yup.string().required().label("Nombre"),
  email: Yup.string().required().email().label("Correo electrónico"),
  phone: Yup.string().required().min(11).label("Teléfono"),
  company: Yup.string().required().label("Empresa"),
  message: Yup.string().required().min(20).label("Mensaje"),
});

const ContactForm = () => {
    // react hook form
  const { register, handleSubmit, formState:{ errors },reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data)
    reset();
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6">
          <div className="contact__input-2">
            <input
              name="name"
              {...register("name",{required:`El nombre es obligatorio`})}
              type="text"
              placeholder="Ingresa tu nombre"
              id="name"
            />
            <ErrorMessage message={errors.name?.message} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="contact__input-2">
            <input
              name="email"
              {...register("email",{required:`El correo electrónico es obligatorio`})}
              type="email"
              placeholder="Ingresa tu correo electrónico"
              id="email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="contact__input-2">
            <input
              name="phone"
              {...register("phone",{required:`El teléfono es obligatorio`})}
              type="text"
              placeholder="Número de celular"
              id="phone"
            />
            <ErrorMessage message={errors.phone?.message} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="contact__input-2">
            <input
              name="company"
              {...register("company",{required:`La empresa es obligatoria`})}
              type="text"
              placeholder="Empresa"
              id="company"
            />
            <ErrorMessage message={errors.company?.message} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="contact__input-2">
            <textarea
              name="message"
              {...register("message",{required:`El mensaje es obligatorio`})}
              id="message"
              placeholder="Tu mensaje"
            ></textarea>
            <ErrorMessage message={errors.message?.message} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="contact__agree d-flex align-items-start mb-25">
            <input className="e-check-input" type="checkbox" id="e-agree" />
            <label className="e-check-label" htmlFor="e-agree">
              Acepto los términos del servicio y la Política de privacidad.
            </label>
          </div>
        </div>
        <div className="col-md-5">
          <div className="contact__btn-2">
            <button type="submit" className="tp-btn">
              Enviar mensaje
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
