// Configurações da aplicação
const API_BASE_URL = window.location.origin;

// Estado da aplicação
let currentUser = null;
let tasks = [];
let currentFilter = 'all';

// Usuário padrão para acesso direto
const DEFAULT_USER = {
    email: 'usuario@exemplo.com',
    password: '12345678'
};

// Elementos do DOM
const authButtons = document.getElementById('authButtons');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const mainContent = document.getElementById('mainContent');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const addTaskForm = document.getElementById('addTaskForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    autoLogin();
});

// Event Listeners
function setupEventListeners() {
    // Formulário de adicionar tarefa
    addTaskForm.addEventListener('submit', handleAddTask);
    
    // Formulários de autenticação
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
        });
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Função para login automático (versão frontend-only)
async function autoLogin() {
    // Simula um delay para mostrar que está "conectando"
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verifica se já existe um usuário logado
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showAuthenticatedUI();
        loadTasks();
        console.log('✅ Usuário já logado!');
        return;
    }
    
    // Se não há usuário, faz login automático
    currentUser = { email: DEFAULT_USER.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showAuthenticatedUI();
    loadTasks();
    
    // Verifica se é a primeira vez e cria tarefas de exemplo
    const hasSampleTasks = localStorage.getItem('hasSampleTasks');
    if (!hasSampleTasks) {
        await createSampleTasks();
        localStorage.setItem('hasSampleTasks', 'true');
    }
    
    console.log('✅ Login automático realizado com sucesso!');
}

// Função para criar tarefas de exemplo
async function createSampleTasks() {
    const sampleTasks = [
        {
            id: Date.now() + 1,
            title: 'Bem-vindo à sua To-Do List! 🎉',
            description: 'Esta é sua primeira tarefa. Você pode editá-la, marcá-la como concluída ou deletá-la.',
            priority: 'high',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            title: 'Adicionar novas tarefas',
            description: 'Use o formulário acima para adicionar suas próprias tarefas.',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            title: 'Testar os filtros',
            description: 'Experimente os botões de filtro para ver tarefas pendentes, concluídas ou todas.',
            priority: 'low',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Salva as tarefas no localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const allTasks = [...sampleTasks, ...existingTasks];
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    // Atualiza o estado
    tasks = allTasks;
    renderTasks();
}

// Autenticação (versão frontend-only)
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simula validação
    if (email && password) {
        currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAuthenticatedUI();
        loadTasks();
        closeModal('loginModal');
        loginForm.reset();
        console.log('✅ Login realizado com sucesso!');
    } else {
        alert('Por favor, preencha todos os campos');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Simula validação
    if (email && password && password.length >= 8) {
        currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAuthenticatedUI();
        loadTasks();
        closeModal('registerModal');
        registerForm.reset();
        console.log('✅ Usuário cadastrado e logado com sucesso!');
    } else {
        alert('Por favor, preencha todos os campos e use uma senha com pelo menos 8 caracteres');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    tasks = [];
    showUnauthenticatedUI();
}

// UI Functions
function showAuthenticatedUI() {
    authButtons.style.display = 'none';
    userInfo.style.display = 'flex';
    mainContent.style.display = 'block';
    userEmail.textContent = currentUser.email;
}

function showUnauthenticatedUI() {
    authButtons.style.display = 'flex';
    userInfo.style.display = 'none';
    mainContent.style.display = 'none';
    tasksList.innerHTML = '';
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Tasks Management (versão frontend-only)
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
    renderTasks();
}

async function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (!title.trim()) {
        alert('Por favor, digite um título para a tarefa');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    addTaskForm.reset();
    
    console.log('✅ Tarefa criada com sucesso!');
}

function toggleTaskStatus(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        console.log('✅ Status da tarefa alterado!');
    }
}

function deleteTask(taskId) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
        return;
    }
    
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    console.log('✅ Tarefa deletada com sucesso!');
}

// Renderização
function renderTasks() {
    const filteredTasks = filterTasks(tasks, currentFilter);
    
    if (filteredTasks.length === 0) {
        tasksList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tasksList.style.display = 'block';
        emptyState.style.display = 'none';
        
        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${escapeHtml(task.title)}</div>
                        <span class="task-priority priority-${task.priority}">
                            ${getPriorityText(task.priority)}
                        </span>
                    </div>
                </div>
                
                ${task.description ? `
                    <div class="task-description-text">${escapeHtml(task.description)}</div>
                ` : ''}
                
                <div class="task-meta">
                    <div class="task-due-date">
                        ${task.dueDate ? `
                            <i class="fas fa-calendar"></i>
                            ${formatDate(new Date(task.dueDate))}
                        ` : ''}
                    </div>
                    
                    <div class="task-actions">
                        <button class="btn-toggle" onclick="toggleTaskStatus(${task.id})">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                            ${task.completed ? 'Desfazer' : 'Concluir'}
                        </button>
                        <button class="btn-delete" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                            Deletar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Filtros
function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Atualizar botões
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderTasks();
}

function filterTasks(tasks, filter) {
    switch (filter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Utilitários
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getPriorityText(priority) {
    const priorities = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta'
    };
    return priorities[priority] || priority;
}

// Funções globais para uso no HTML
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.logout = logout;
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask; 