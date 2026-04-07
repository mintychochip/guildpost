// Toast notification system
export function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  
  // Colors based on type
  const colors = {
    success: 'bg-green-500',
    error: 'bg-[#ff3864]',
    info: 'bg-[#00f5d4]',
    warning: 'bg-yellow-500'
  };
  
  const textColors = {
    success: 'text-white',
    error: 'text-white',
    info: 'text-[#0a0a0f]',
    warning: 'text-white'
  };
  
  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>'
  };
  
  toast.className = `fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 ${colors[type]} ${textColors[type]} rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300`;
  toast.innerHTML = `
    ${icons[type]}
    <span class="font-medium">${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-2 opacity-70 hover:opacity-100">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-full', 'opacity-0');
  });
  
  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Skeleton loader component
export function createSkeleton(type = 'card', count = 1) {
  const shimmer = 'animate-pulse bg-gradient-to-r from-[#1a1a25] via-[#2a2a3a] to-[#1a1a25] bg-[length:200%_100%]';
  
  const skeletons = {
    card: `
      <div class="p-4 bg-[#12121a] border border-[#2a2a3a] rounded-lg ${shimmer}">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-[#1a1a25] rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-[#1a1a25] rounded w-3/4"></div>
            <div class="h-3 bg-[#1a1a25] rounded w-1/2"></div>
            <div class="flex gap-2 mt-3">
              <div class="h-3 bg-[#1a1a25] rounded w-16"></div>
              <div class="h-3 bg-[#1a1a25] rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `<div class="h-4 bg-[#1a1a25] rounded ${shimmer} w-full"></div>`,
    avatar: `<div class="w-10 h-10 bg-[#1a1a25] rounded-full ${shimmer}"></div>`,
    button: `<div class="h-10 bg-[#1a1a25] rounded-lg ${shimmer} w-full"></div>`,
    stats: `
      <div class="p-4 bg-[#12121a] border border-[#2a2a3a] rounded-lg ${shimmer}">
        <div class="h-8 bg-[#1a1a25] rounded w-1/2 mx-auto mb-2"></div>
        <div class="h-3 bg-[#1a1a25] rounded w-2/3 mx-auto"></div>
      </div>
    `
  };
  
  return Array(count).fill(skeletons[type] || skeletons.card).join('');
}

// Page transition
export function pageTransition(callback) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[100] bg-[#0a0a0f] transform translate-y-full transition-transform duration-300';
  document.body.appendChild(overlay);
  
  requestAnimationFrame(() => {
    overlay.classList.remove('translate-y-full');
  });
  
  setTimeout(() => {
    callback();
    overlay.classList.add('translate-y-full');
    setTimeout(() => overlay.remove(), 300);
  }, 300);
}
