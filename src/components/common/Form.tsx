import React, { FormEvent, HTMLAttributes, ReactNode } from 'react';

interface CustomForm extends HTMLAttributes<HTMLFormElement> {
    children? : ReactNode;
    onSubmit: (e:FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children,  onSubmit, ...props }: CustomForm) {
    return (
        <form
            {...props}
            onSubmit={(e) => {
                onSubmit(e);
            }
            }>
            {children && children}
        </form>
    );
}
