import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContent, Background } from './styles';

interface ForgotPasswordFormData {
  email: string;
}
const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // TODO fazer envio de senha p email

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);

          return;
        }

        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      }
    },
    [addToast],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContent>
            <img src={logoImg} alt="GoBarber" />
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Recuperar senha</h1>
              <Input
                name="email"
                icon={FiMail}
                type="text"
                placeholder="E-mail"
              />

              <Button type="submit">Recuperar</Button>
            </Form>
            <Link to="/signin">
              <FiLogIn /> Voltar ao login
            </Link>
          </AnimationContent>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;