// Data Management
let members = JSON.parse(localStorage.getItem('members')) || [];
let trainers = JSON.parse(localStorage.getItem('trainers')) || [];
let plans = JSON.parse(localStorage.getItem('plans')) || [];

// Initialize default data if empty
if (plans.length === 0) {
    plans = [
        {
            id: 1,
            name: 'Basic',
            price: 29.99,
            duration: 1,
            features: ['gym_access', 'locker'],
            color: 'blue'
        },
        {
            id: 2,
            name: 'Premium',
            price: 49.99,
            duration: 3,
            features: ['gym_access', 'classes', 'locker'],
            color: 'purple'
        },
        {
            id: 3,
            name: 'Elite',
            price: 89.99,
            duration: 6,
            features: ['gym_access', 'classes', 'trainer', 'locker'],
            color: 'yellow'
        }
    ];
    localStorage.setItem('plans', JSON.stringify(plans));
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('opacity-100');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    modal.classList.remove('opacity-100');
}

// Dashboard Update
function updateDashboard() {
    // Update total members
    document.getElementById('totalMembers').textContent = members.length;
    
    // Calculate member growth
    const lastMonthMembers = members.filter(m => 
        new Date(m.joinDate) < new Date() && 
        new Date(m.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    const memberGrowth = members.length > 0 ? 
        ((lastMonthMembers / members.length) * 100).toFixed(1) : 0;
    document.getElementById('memberGrowth').textContent = `+${memberGrowth}% from last month`;

    // Update total trainers
    document.getElementById('totalTrainers').textContent = trainers.length;

    // Calculate monthly revenue
    const monthlyRevenue = members.reduce((sum, member) => {
        const plan = plans.find(p => p.name === member.plan);
        return sum + (plan ? plan.price : 0);
    }, 0);
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);

    // Update active plans
    document.getElementById('activePlans').textContent = plans.length;
}

// Members Functions
function updateMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';
    
    members.forEach((member, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-user text-gray-500"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${member.name}</div>
                        <div class="text-sm text-gray-500">${member.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${plans.find(p => p.name === member.plan)?.color}-100 text-${plans.find(p => p.name === member.plan)?.color}-800">
                    ${member.plan}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${member.trainer || 'No Trainer'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(member.joinDate)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="showMemberDetails(${index})" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteMember(${index})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addMember(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const member = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        plan: formData.get('plan'),
        trainer: formData.get('trainer'),
        joinDate: new Date().toISOString(),
        status: 'active'
    };
    members.push(member);
    localStorage.setItem('members', JSON.stringify(members));
    hideModal('addMemberModal');
    event.target.reset();
    updateMembersTable();
    updateDashboard();
}

function showMemberDetails(index) {
    const member = members[index];
    const plan = plans.find(p => p.name === member.plan);
    const content = document.getElementById('memberDetailsContent');
    
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <h4 class="text-sm font-medium text-gray-500">Personal Information</h4>
                <div class="mt-2 space-y-2">
                    <p class="text-sm text-gray-900"><span class="font-medium">Name:</span> ${member.name}</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Email:</span> ${member.email}</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Phone:</span> ${member.phone}</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Join Date:</span> ${formatDate(member.joinDate)}</p>
                </div>
            </div>
            <div>
                <h4 class="text-sm font-medium text-gray-500">Membership Details</h4>
                <div class="mt-2 space-y-2">
                    <p class="text-sm text-gray-900"><span class="font-medium">Plan:</span> ${member.plan}</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Price:</span> ${formatCurrency(plan.price)}/month</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Trainer:</span> ${member.trainer || 'No Trainer'}</p>
                    <p class="text-sm text-gray-900"><span class="font-medium">Status:</span> 
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-500">Plan Features</h4>
            <div class="mt-2 grid grid-cols-2 gap-2">
                ${plan.features.map(feature => `
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-check text-green-500"></i>
                        <span class="text-sm text-gray-900">${feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal('memberDetailsModal');
}

function deleteMember(index) {
    if (confirm('Are you sure you want to delete this member?')) {
        members.splice(index, 1);
        localStorage.setItem('members', JSON.stringify(members));
        updateMembersTable();
        updateDashboard();
    }
}

// Trainers Functions
// Trainers Functions (continued)
function updateTrainersGrid() {
  const grid = document.getElementById('trainersGrid');
  grid.innerHTML = '';
  
  trainers.forEach((trainer, index) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200';
      div.innerHTML = `
          <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <i class="fas fa-user-tie text-green-600"></i>
                  </div>
                  <div>
                      <h3 class="text-sm font-medium text-gray-900">${trainer.name}</h3>
                      <p class="text-xs text-gray-500">${trainer.specialization}</p>
                  </div>
              </div>
              <button onclick="deleteTrainer(${index})" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
              </button>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                  <span class="text-gray-500">Experience:</span>
                  <span class="ml-1 text-gray-900">${trainer.experience} years</span>
              </div>
              <div>
                  <span class="text-gray-500">Contact:</span>
                  <span class="ml-1 text-gray-900">${trainer.phone}</span>
              </div>
          </div>
      `;
      grid.appendChild(div);
  });
}

function addTrainer(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const trainer = {
      name: formData.get('name'),
      specialization: formData.get('specialization'),
      experience: formData.get('experience'),
      phone: formData.get('phone')
  };
  trainers.push(trainer);
  localStorage.setItem('trainers', JSON.stringify(trainers));
  hideModal('addTrainerModal');
  event.target.reset();
  updateTrainersGrid();
  updateTrainerDropdowns();
  updateDashboard();
}

function deleteTrainer(index) {
  if (confirm('Are you sure you want to delete this trainer?')) {
      // Update members who had this trainer assigned
      const trainerName = trainers[index].name;
      members.forEach(member => {
          if (member.trainer === trainerName) {
              member.trainer = '';
          }
      });
      localStorage.setItem('members', JSON.stringify(members));
      
      trainers.splice(index, 1);
      localStorage.setItem('trainers', JSON.stringify(trainers));
      updateTrainersGrid();
      updateTrainerDropdowns();
      updateMembersTable();
      updateDashboard();
  }
}

// Plans Functions
function updatePlansGrid() {
  const grid = document.getElementById('plansGrid');
  grid.innerHTML = '';
  
  plans.forEach((plan, index) => {
      const div = document.createElement('div');
      div.className = `bg-${plan.color}-50 p-4 rounded-lg shadow-sm border border-${plan.color}-200`;
      div.innerHTML = `
          <div class="flex items-center justify-between">
              <div>
                  <h3 class="text-lg font-medium text-gray-900">${plan.name}</h3>
                  <p class="text-sm text-gray-500">${formatCurrency(plan.price)}/month</p>
              </div>
              <button onclick="deletePlan(${index})" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
              </button>
          </div>
          <div class="mt-4">
              <p class="text-sm text-gray-600">Duration: ${plan.duration} month${plan.duration > 1 ? 's' : ''}</p>
              <div class="mt-2 space-y-1">
                  ${plan.features.map(feature => `
                      <div class="flex items-center space-x-2">
                          <i class="fas fa-check text-${plan.color}-500 text-sm"></i>
                          <span class="text-sm text-gray-600">${feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                  `).join('')}
              </div>
          </div>
      `;
      grid.appendChild(div);
  });
}

function addPlan(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const features = formData.getAll('features');
  const plan = {
      id: plans.length + 1,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      duration: parseInt(formData.get('duration')),
      features: features,
      color: ['blue', 'purple', 'yellow'][plans.length % 3] // Cycle through colors
  };
  plans.push(plan);
  localStorage.setItem('plans', JSON.stringify(plans));
  hideModal('addPlanModal');
  event.target.reset();
  updatePlansGrid();
  updatePlanDropdowns();
  updateDashboard();
}

function deletePlan(index) {
  if (confirm('Are you sure you want to delete this plan?')) {
      // Check if any members are using this plan
      const planName = plans[index].name;
      if (members.some(member => member.plan === planName)) {
          alert('Cannot delete plan while members are actively subscribed to it.');
          return;
      }
      
      plans.splice(index, 1);
      localStorage.setItem('plans', JSON.stringify(plans));
      updatePlansGrid();
      updatePlanDropdowns();
      updateDashboard();
  }
}

// Dropdown Updates
function updateTrainerDropdowns() {
  const trainerSelects = document.querySelectorAll('select[name="trainer"]');
  trainerSelects.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">No Trainer</option>';
      trainers.forEach(trainer => {
          const option = new Option(trainer.name, trainer.name);
          select.add(option);
      });
      if (currentValue && trainers.some(t => t.name === currentValue)) {
          select.value = currentValue;
      }
  });
}

function updatePlanDropdowns() {
  const planSelects = document.querySelectorAll('select[name="plan"]');
  planSelects.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '';
      plans.forEach(plan => {
          const option = new Option(plan.name, plan.name);
          select.add(option);
      });
      if (currentValue && plans.some(p => p.name === currentValue)) {
          select.value = currentValue;
      }
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  updateDashboard();
  updateMembersTable();
  updateTrainersGrid();
  updatePlansGrid();
  updateTrainerDropdowns();
  updatePlanDropdowns();
  
  // Form submissions
  document.getElementById('addMemberForm').addEventListener('submit', addMember);
  document.getElementById('addTrainerForm').addEventListener('submit', addTrainer);
  document.getElementById('addPlanForm').addEventListener('submit', addPlan);
  
  // Modal close buttons
  document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
          if (e.target === modal) {
              modal.classList.add('hidden');
          }
      });
  });
});

// Export functionality for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
      members,
      trainers,
      plans,
      formatCurrency,
      formatDate,
      addMember,
      addTrainer,
      addPlan,
      deleteMember,
      deleteTrainer,
      deletePlan
  };
}