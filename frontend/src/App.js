import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Sayfa yüklendiğinde görevleri getir
  useEffect(() => {
    fetch(`${BACKEND_URL}/tasks`)
      .then(res => res.json())
      .then(data => {
        console.log("🎯 Gelen görev listesi:", data);
        setTasks(data);
      });
  }, []);

  // Yeni görev ekle
  const addTask = () => {
    const task = { name: newTask, completed: false };

    fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
      .then(res => res.json()) // ↩️ Eklenen görevi geri al
      .then(createdTask => {
        setTasks([...tasks, createdTask]); // ↩️ Yeni görevi listeye ekle
        setNewTask('');
      });
  };

  // Görev tamamlandı/tamamlanmadı toggle
  const toggleComplete = (id) => {
    fetch(`${BACKEND_URL}/tasks/${id}`, { method: 'PUT' })
      .then(() => {
        setTasks(tasks.map(task =>
          task._id === id ? { ...task, completed: !task.completed } : task
        ));
      });
  };

  // Görev sil
  const deleteTask = (id) => {
    console.log("🗑️ Silinecek görev ID'si:", id);
    fetch(`${BACKEND_URL}/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4">
  <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
      📝 Görev Takip Uygulaması
    </h1>
    <div className="text-center text-gray-600 text-sm mb-4">
  Toplam görev: {tasks.length} | Tamamlandı: {tasks.filter(t => t.completed).length}
</div>

    <div className="flex mb-4">
      <input
        className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Yeni görev gir..."
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
      />
      <button
        onClick={addTask}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition"
      >
        Ekle
      </button>
    </div>

    <ul className="space-y-2">
  {tasks.map((task) => (
    <li
    key={task._id}
    onClick={() => toggleComplete(task._id)}
    className={`flex justify-between items-center p-3 rounded-lg border transition cursor-pointer 
      ${task.completed ? 'bg-green-100' : 'bg-white'} hover:bg-gray-100`}
  >
    <div className="flex items-center">
      {task.completed && (
        <span className="text-green-600 mr-2">✔️</span>
      )}
      <span>
        {task.name}
      </span>
    </div>
  
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteTask(task._id);
      }}
      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded shadow-sm text-sm"
    >
      Sil
    </button>
  </li>
  
  
  ))}
</ul>

  </div>
</div>

  );
}

export default App;
