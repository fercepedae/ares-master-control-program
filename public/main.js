const token = localStorage.getItem('token');
if(!token){ window.location.href = '/'; }

const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('token'); window.location.href = '/'; });

async function api(url, opts={}){
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if(token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(url, opts);
  return res.json();
}

async function loadPrograms(){
  const list = document.getElementById('programList');
  list.innerHTML = 'Cargando...';
  const programs = await api('/api/programs');
  list.innerHTML = '';
  (programs||[]).forEach(p=>{
    const li = document.createElement('li');
    li.textContent = p.name + ' (' + p.priority + ')';
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.addEventListener('click', async ()=>{
      await api('/api/programs/'+p._id,{method:'DELETE'});
      loadPrograms();
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

const createForm = document.getElementById('createForm');
createForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;
  await api('/api/programs',{method:'POST',body:JSON.stringify({name,description,priority})});
  createForm.reset();
  loadPrograms();
});

loadPrograms();
