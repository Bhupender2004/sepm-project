import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    type InputProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface FormInputProps extends InputProps {
    label?: string;
    error?: string;
    id: string;
    type?: string;
    placeholder?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, id, ...props }, ref) => {
        return (
            <FormControl isInvalid={!!error}>
                {label && (
                    <FormLabel
                        htmlFor={id}
                        fontWeight="500"
                        color="gray.600"
                        _dark={{ color: 'gray.300' }}
                        fontSize="sm"
                        mb={2}
                    >
                        {label}
                    </FormLabel>
                )}
                <Input
                    ref={ref}
                    id={id}
                    variant="filled"
                    height="50px"
                    fontSize="md"
                    {...props}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
