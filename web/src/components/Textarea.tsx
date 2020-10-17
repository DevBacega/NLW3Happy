import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

interface TextProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

const Textarea: React.FC<TextProps> = ({ name, ...rest }: TextProps) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textarea.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <textarea defaultValue={defaultValue} ref={textarea} {...rest} />
  );
};

export default Textarea;
