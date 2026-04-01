import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  editingTodo: Todo | null;
  newTitle: string;
  setEditingTodo: (todo: Todo | null) => void;
  setNewTitle: (title: string) => void;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  editingTodo,
  newTitle,
  setEditingTodo,
  setNewTitle,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingIds.includes(todo.id)}
        editingTodo={editingTodo}
        newTitle={newTitle}
        setEditingTodo={setEditingTodo}
        setNewTitle={setNewTitle}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isTemp />}
  </section>
);
