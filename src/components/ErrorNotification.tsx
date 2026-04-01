import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  message: ErrorMessage | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => (
  <div className={`notification ${!message ? 'hidden' : ''}`}>
    <button className="delete" onClick={onClose} />
    {message}
  </div>
);
