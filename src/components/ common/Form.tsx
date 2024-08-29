import React, { HTMLAttributes, ReactNode } from 'react';

interface CustomForm extends HTMLAttributes<HTMLFormElement> {
    children? : ReactNode;
}

export default function Form({ children, ...props }: CustomForm) {
    return (
        <form
            {...props}
            onSubmit={(e) => e.preventDefault()}>
            {children && children}
        </form>
    );
}
