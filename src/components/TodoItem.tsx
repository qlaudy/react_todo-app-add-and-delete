/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting?: boolean;
  isTemp?: boolean;
  editingTodo?: Todo | null;
  newTitle?: string;
  setEditingTodo?: (todo: Todo | null) => void;
  setNewTitle?: (title: string) => void;
  onDelete?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isTemp,
  editingTodo,
  newTitle,
  setEditingTodo,
  setNewTitle,
  onDelete,
}) => {
  const isEditing = editingTodo?.id === todo.id;

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input type="checkbox" checked={todo.completed} readOnly />
      </label>

      <span
        className="todo__title"
        onDoubleClick={() => {
          if (!isTemp) {
            setEditingTodo?.(todo);
            setNewTitle?.(todo.title);
          }
        }}
      >
        {isEditing ? (
          <form>
            <input
              className="todo__title-field"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle?.(e.target.value)}
              onKeyUp={e => {
                if (e.key === 'Escape') {
                  setEditingTodo?.(null);
                }
              }}
            />
          </form>
        ) : (
          todo.title
        )}
      </span>

      <button
        type="button"
        className="todo__remove"
        disabled={isTemp}
        onClick={() => onDelete?.(todo.id)}
      >
        ×
      </button>

      <div
        className={`modal overlay ${isDeleting || isTemp ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
