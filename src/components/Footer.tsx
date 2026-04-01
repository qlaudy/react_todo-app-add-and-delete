import React from 'react';
import { Status } from '../types/Status';

type Props = {
  count: number;
  filter: Status;
  setFilter: (s: Status) => void;
  hasCompleted: boolean;
  onClear: () => void;
};

export const Footer: React.FC<Props> = ({
  count,
  filter,
  setFilter,
  hasCompleted,
  onClear,
}) => (
  <footer className="todoapp__footer">
    <span>{count} items left</span>

    <nav className="filter">
      {Object.values(Status).map(status => (
        <a
          key={status}
          className={filter === status ? 'selected' : ''}
          onClick={() => setFilter(status)}
        >
          {status}
        </a>
      ))}
    </nav>

    <button disabled={!hasCompleted} onClick={onClear}>
      Clear completed
    </button>
  </footer>
);
