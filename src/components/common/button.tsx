import React from 'react';

export default function Button({
  children,
  ...props
}: {
  children: any;
  [key: string]: any;
}) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {children}
    </button>
  );
}
