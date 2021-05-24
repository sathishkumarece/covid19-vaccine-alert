import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import { Input } from 'reactstrap'

class TextValidator extends ValidatorComponent {

    renderValidatorComponent() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <div>
                <Input
                    className="form-control"
                    {...rest}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </div>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div className="text-danger">
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default TextValidator;
