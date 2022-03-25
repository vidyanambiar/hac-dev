import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Popover,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import './SimpleForm.scss';

type UserInfoState = {
  fullName: string;
  email: string;
  phone: string;
};

type ContactMethodState = {
  byEmail: boolean;
  byPhone: boolean;
  doNotContact: boolean;
};

const SimpleForm: React.FC<{}> = () => {
  // Use React hook: useState

  // Using objects in state
  const [userInfoState, setUserInfoState] = React.useState<UserInfoState>({} as UserInfoState);

  const [contactMethodState, setContactMethodState] = React.useState<ContactMethodState>(
    {} as ContactMethodState,
  );

  const handleTextInputChange = (value: string, e: React.FormEvent<HTMLInputElement>): void => {
    const { name } = e.currentTarget;
    setUserInfoState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactMethodChange = (
    checked: boolean,
    e: React.FormEvent<HTMLInputElement>,
  ): void => {
    const { id } = e.currentTarget;
    setContactMethodState((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  return (
    <Form className="hacDev-form-component">
      <FormGroup
        label="Full name"
        labelIcon={
          <Popover
            headerContent={
              <div>
                The{' '}
                <a href="https://schema.org/name" target="_blank" rel="noreferrer">
                  name
                </a>{' '}
                of a{' '}
                <a href="https://schema.org/Person" target="_blank" rel="noreferrer">
                  Person
                </a>
              </div>
            }
            bodyContent={
              <div>
                Often composed of{' '}
                <a href="https://schema.org/givenName" target="_blank" rel="noreferrer">
                  givenName
                </a>{' '}
                and{' '}
                <a href="https://schema.org/familyName" target="_blank" rel="noreferrer">
                  familyName
                </a>
                .
              </div>
            }
          >
            <button
              type="button"
              aria-label="More info for name field"
              onClick={(e) => e.preventDefault()}
              aria-describedby="simple-form-name-01"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
          </Popover>
        }
        isRequired
        fieldId="simple-form-name-01"
        helperText="Include your middle name if you have one."
      >
        <TextInput
          isRequired
          type="text"
          id="simple-form-name-01"
          name="fullName"
          aria-describedby="simple-form-name-01-helper"
          value={userInfoState.fullName}
          onChange={handleTextInputChange}
        />
      </FormGroup>
      <FormGroup label="Email" isRequired fieldId="simple-form-email-01">
        <TextInput
          isRequired
          type="email"
          id="simple-form-email-01"
          name="email"
          value={userInfoState.email}
          onChange={handleTextInputChange}
        />
      </FormGroup>
      <FormGroup label="Phone number" isRequired fieldId="simple-form-number-01">
        <TextInput
          isRequired
          type="tel"
          id="simple-form-number-01"
          placeholder="555-555-5555"
          name="phone"
          value={userInfoState.phone}
          onChange={handleTextInputChange}
        />
      </FormGroup>
      <FormGroup
        isInline
        fieldId="simple-form-checkbox-group"
        label="How can we contact you?"
        isRequired
      >
        <Checkbox
          label="Email"
          aria-label="Email"
          id="byEmail"
          isChecked={contactMethodState.byEmail}
          onChange={handleContactMethodChange}
        />
        <Checkbox
          label="Phone"
          aria-label="Phone"
          id="byPhone"
          isChecked={contactMethodState.byPhone}
          onChange={handleContactMethodChange}
        />
        <Checkbox
          label="Please don't contact me."
          aria-label="Please don't contact me."
          id="doNotContact"
          isChecked={contactMethodState.doNotContact}
          onChange={handleContactMethodChange}
        />
      </FormGroup>
      <FormGroup label="Additional note" fieldId="simple-form-note-01">
        <TextInput
          isDisabled
          type="text"
          id="simple-form-note-01"
          name="simple-form-number"
          value="disabled"
        />
      </FormGroup>
      <FormGroup fieldId="checkbox01">
        <Checkbox
          label="I'd like updates via email."
          id="checkbox01"
          name="checkbox01"
          aria-label="Update via email"
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary">Submit</Button>
        <Button variant="link">Cancel</Button>
      </ActionGroup>
    </Form>
  );
};

export default SimpleForm;
