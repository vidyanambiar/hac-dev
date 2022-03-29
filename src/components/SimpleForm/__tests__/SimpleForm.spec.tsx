import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimpleForm from '../SimpleForm';

describe('SimpleForm', () => {
  beforeEach(() => render(<SimpleForm />));

  it('should render text input field for full name', () => {
    expect(screen.getByText('Full name')).toBeVisible();
  });

  it('should validate input for phone number', () => {
    const phoneInputElement = screen.getByPlaceholderText('555-555-5555');
    expect(phoneInputElement).toBeVisible();

    // Input invalid phone number
    fireEvent.input(phoneInputElement, {
      target: { value: 'abc' },
    });
    expect(screen.getByText('Must be a valid phone number')).toBeVisible();

    // Input invalid phone number
    fireEvent.input(phoneInputElement, {
      target: { value: '567-1234-444' },
    });
    expect(screen.getByText('Must be a valid phone number')).toBeVisible();

    // Input valid phone number
    fireEvent.input(phoneInputElement, {
      target: { value: '(567) 431-4414' },
    });
    expect(screen.queryByText('Must be a valid phone number')).not.toBeInTheDocument();
  });
});
