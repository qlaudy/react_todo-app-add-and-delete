/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, removeTodoApi, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const todoFieldRef = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => setIsLoading(false));

    todoFieldRef.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      showError(ErrorMessage.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedQuery,
      completed: false,
      userId: USER_ID,
    });

    setIsLoading(true);

    createTodo({ title: trimmedQuery, userId: USER_ID, completed: false })
      .then((todoFromServer: Todo) => {
        setTodos(prev => [...prev, todoFromServer]);
        setQuery('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);

        return Promise.reject();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);

        todoFieldRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number, silent = false) => {
    if (!silent) {
      setErrorMessage(null);
    }

    setDeletingIds(prev => [...prev, todoId]);

    return removeTodoApi(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        if (!silent) {
          showError(ErrorMessage.Delete);
        }

        return Promise.reject();
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        todoFieldRef.current?.focus();
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const promises = completedTodos.map(todo => deleteTodo(todo.id), true);

    Promise.allSettled(promises).then(results => {
      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        showError(ErrorMessage.Delete);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          hasTempTodo={!!tempTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            editingTodo={editingTodo}
            newTitle={newTitle}
            setEditingTodo={setEditingTodo}
            setNewTitle={setNewTitle}
            onDelete={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            count={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClear={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
