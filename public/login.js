async function postJSON(url, body){
  const res = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return res.json();
}

const form = document.getElementById('loginForm');
const msg = document.getElementById('message');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try{
    const data = await postJSON('/api/auth/login',{email:username,password});
    if(data.token){
      localStorage.setItem('token',data.token);
      window.location.href = '/main.html';
    } else {
      msg.textContent = data.message || data.error || 'Credenciales inválidas';
    }
  }catch(err){
    msg.textContent = 'Error comunicándose con el servidor';
  }
});
