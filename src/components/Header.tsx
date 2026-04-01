import React from 'react';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hasTempTodo: boolean;
};

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
  hasTempTodo,
}) => (
  <header className="todoapp__header">
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={e => setQuery(e.target.value)}
        disabled={isLoading || hasTempTodo}
      />
    </form>
  </header>
);
