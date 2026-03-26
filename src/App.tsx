import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { applyTelegramThemeVars, getTelegramWebApp } from "./lib/telegram";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Folder = {
  id: string;
  name: string;
  tasks: Task[];
};

type ModalMode = "folder" | "task" | null;

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: createId(),
    name: "Работа",
    tasks: [
      { id: createId(), title: "Подготовить отчет", done: false },
      { id: createId(), title: "Отправить обновления в чат", done: true },
    ],
  },
  {
    id: createId(),
    name: "Дом",
    tasks: [{ id: createId(), title: "Купить продукты", done: false }],
  },
];

function App() {
  const webApp = useMemo(() => getTelegramWebApp(), []);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    INITIAL_FOLDERS[0]?.id ?? ""
  );
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalValue, setModalValue] = useState<string>("");

  useEffect(() => {
    if (!webApp) {
      return;
    }

    applyTelegramThemeVars(webApp);
    webApp.ready();
    webApp.expand();
    webApp.MainButton.hide();
  }, [webApp]);

  const selectedFolder = useMemo(() => {
    return folders.find((folder) => folder.id === selectedFolderId) ?? null;
  }, [folders, selectedFolderId]);

  const openCreateFolderModal = () => {
    setModalMode("folder");
    setModalValue("");
  };

  const openCreateTaskModal = () => {
    if (!selectedFolder) {
      return;
    }

    setModalMode("task");
    setModalValue("");
  };

  const closeModal = () => {
    setModalMode(null);
    setModalValue("");
  };

  const submitModal = () => {
    const value = modalValue.trim();
    if (!value) {
      return;
    }

    if (modalMode === "folder") {
      const newFolder: Folder = {
        id: createId(),
        name: value,
        tasks: [],
      };

      setFolders((prev) => [newFolder, ...prev]);
      setSelectedFolderId(newFolder.id);
      closeModal();
      return;
    }

    if (modalMode === "task" && selectedFolderId) {
      const newTask: Task = {
        id: createId(),
        title: value,
        done: false,
      };

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === selectedFolderId
            ? { ...folder, tasks: [newTask, ...folder.tasks] }
            : folder
        )
      );
      closeModal();
    }
  };

  const toggleTask = (taskId: string) => {
    if (!selectedFolderId) {
      return;
    }

    setFolders((prev) =>
      prev.map((folder) => {
        if (folder.id !== selectedFolderId) {
          return folder;
        }

        return {
          ...folder,
          tasks: folder.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task
          ),
        };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    if (!selectedFolderId) {
      return;
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === selectedFolderId
          ? {
              ...folder,
              tasks: folder.tasks.filter((task) => task.id !== taskId),
            }
          : folder
      )
    );
  };

  return (
    <div className="app-shell">
      <aside className="folders-panel">
        <div className="panel-header">
          <h1>Папки</h1>
          <button
            type="button"
            className="primary-btn"
            onClick={openCreateFolderModal}
          >
            + Новая папка
          </button>
        </div>

        <div className="folders-list">
          {folders.map((folder) => (
            <button
              type="button"
              key={folder.id}
              className={`folder-item ${
                folder.id === selectedFolderId ? "folder-item--active" : ""
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              <span className="folder-item__name">{folder.name}</span>
              <span className="folder-item__count">{folder.tasks.length}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="tasks-panel">
        {!selectedFolder ? (
          <div className="empty-state">Создайте первую папку</div>
        ) : (
          <>
            <div className="panel-header panel-header--tasks">
              <h2>{selectedFolder.name}</h2>
              <button
                type="button"
                className="primary-btn"
                onClick={openCreateTaskModal}
              >
                + Добавить задание
              </button>
            </div>

            {selectedFolder.tasks.length === 0 ? (
              <div className="empty-state">
                В этой папке пока нет заданий. Добавьте первое.
              </div>
            ) : (
              <ul className="task-list">
                {selectedFolder.tasks.map((task) => (
                  <li className="task-item" key={task.id}>
                    <button
                      type="button"
                      className={`icon-btn ${task.done ? "icon-btn--done" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label="Отметить выполненным"
                      title="Отметить"
                    >
                      {"\u2713"}
                    </button>
                    <span className={`task-title ${task.done ? "task-title--done" : ""}`}>
                      {task.title}
                    </span>
                    <button
                      type="button"
                      className="icon-btn icon-btn--delete"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Удалить задание"
                      title="Удалить"
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {modalMode && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={modalMode === "folder" ? "Создание папки" : "Создание задания"}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{modalMode === "folder" ? "Новая папка" : "Новое задание"}</h3>
            <input
              className="modal-input"
              value={modalValue}
              onChange={(event) => setModalValue(event.target.value)}
              placeholder={
                modalMode === "folder" ? "Введите имя папки" : "Введите название задания"
              }
              autoFocus
            />
            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={closeModal}>
                Отмена
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={submitModal}
                disabled={!modalValue.trim()}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


