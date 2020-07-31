import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ForgotPassword from '../../pages/ForgotPassword';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockedAddToast = jest.fn();
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

const mockedApi = jest.fn();

jest.mock('../../services/api', () => {
  return {
    post: () => mockedApi,
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedApi.mockClear();
  });

  it('should be able to info forgot-password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    // wait - function used with async methods
    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to info forgot-password when email does not exists or invalid e-mail', () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'invalid-credentials' } });

    fireEvent.click(buttonElement);

    // wait - function used with async methods
    wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should not be able to info forgot-password when email not registered', async () => {
    mockedApi.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'marydoe@example.com' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
