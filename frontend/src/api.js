const API = import.meta.env.VITE_API_URL;

export async function simulate(body) {
  const res = await fetch(`${API}/simulate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return res.json();
}

export async function saveScenario(body) {
  const res = await fetch(`${API}/scenarios`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return res.json();
}

export async function listScenarios() {
  const res = await fetch(`${API}/scenarios`);
  return res.json();
}

export async function getScenario(id) {
  const res = await fetch(`${API}/scenarios/${id}`);
  return res.json();
}

export async function deleteScenario(id) {
  const res = await fetch(`${API}/scenarios/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function generateReport(body) {
  const res = await fetch(`${API}/report/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return res.json();
}
