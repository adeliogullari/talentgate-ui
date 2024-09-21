"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface EmailInputProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string
    type: React.HTMLInputTypeAttribute
    placeholder: string
    value: string | number | readonly string[]
    onChange: React.ChangeEventHandler<HTMLInputElement>
    className: string
}

const EmailInput = ({ ...props }: Partial<EmailInputProps>) => {
    return (
        <Input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className={props.className}
        />
    );
};

export default EmailInput;