const skillBank=["C/C++","Python","Java","JavaScript","HTML/CSS","Git/GitHub","SQL","Data Structures","Statistics","Linear Algebra","Machine Learning","Deep Learning","NLP","Computer Vision","Cloud","Linux","Docker","ROS/Robotics"];
const careers={
aiml:{name:"AI / ML Engineer",skills:["Python","Data Structures","Statistics","Linear Algebra","Machine Learning","Deep Learning","Git/GitHub","SQL"],projects:[["End-to-End ML Predictor","Train, evaluate and deploy a real ML model with an API."],["Computer Vision Classifier","Build a CNN/image classifier and document experiments."],["RAG Study Assistant","Create a retrieval-augmented AI assistant over a small knowledge base."],["MLOps Mini Pipeline","Version data/models and automate training + evaluation."]]},
software:{name:"Software Engineer",skills:["C/C++","Python","JavaScript","Data Structures","Git/GitHub","SQL","Linux","Docker"],projects:[["Full-Stack Task Manager","Authentication, CRUD APIs, database and responsive UI."],["DSA Visualizer","Interactive visualizations for sorting, trees and graphs."],["Real-Time Chat App","WebSocket-based chat with persistence."],["Deployable Microservice","Containerized REST service with tests and CI."]]},
data:{name:"Data Scientist",skills:["Python","SQL","Statistics","Linear Algebra","Machine Learning","Git/GitHub"],projects:[["EDA + Business Dashboard","Turn a messy dataset into insights and an interactive dashboard."],["Customer Churn Model","Build a predictive pipeline and explain model decisions."],["Recommendation Engine","Create and evaluate a recommendation system."],["Data Pipeline","Collect, clean and transform data with reproducible steps."]]},
robotics:{name:"Robotics Engineer",skills:["C/C++","Python","Linear Algebra","Data Structures","Linux","ROS/Robotics","Computer Vision","Git/GitHub"],projects:[["Line-Following Robot","Sensor fusion, control logic and obstacle handling."],["Robot Vision System","Detect and track objects from a camera feed."],["ROS Mobile Robot","Create nodes, topics and navigation in simulation."],["Autonomous Rover","Combine perception, planning and control in a capstone."]]},
cloud:{name:"Cloud Engineer",skills:["Python","JavaScript","Linux","Git/GitHub","Docker","SQL","Cloud"],projects:[["Containerized Web App","Build and deploy a full-stack app using Docker."],["CI/CD Pipeline","Automate testing and deployment from GitHub."],["Cloud Monitoring Demo","Instrument an app with logs, metrics and alerts."],["Scalable API","Design a stateless API with caching and database scaling concepts."]]}
};
const selected=new Set();
const skillsEl=document.getElementById("skills");
skillBank.forEach(s=>{const b=document.createElement("button");b.className="chip";b.textContent=s;b.onclick=()=>{selected.has(s)?(selected.delete(s),b.classList.remove("selected")):(selected.add(s),b.classList.add("selected"))};skillsEl.appendChild(b)});

function generateLocalRoadmap(){
 const key=document.getElementById("career").value, c=careers[key], hours=+document.getElementById("hours").value;
 const coverage=Math.round(c.skills.filter(s=>selected.has(s)).length/c.skills.length*100);
 document.getElementById("dashTitle").textContent=c.name+" Roadmap";
 document.getElementById("coverage").textContent=coverage+"%";
 document.getElementById("match").textContent=Math.round(Math.min(96,70+coverage/4))+"%";
 document.getElementById("duration").textContent=(hours>=20? "6–8":hours>=15?"8–10":hours>=10?"10–12":"12–16")+" mo";
 document.getElementById("dashSummary").textContent=`Based on your selected skills, projects and ${hours} hours/week, here is a practical sequence from your current level to an industry-oriented portfolio.`;

 document.getElementById("skillBars").innerHTML=c.skills.map(s=>{
   const have=selected.has(s), pct=have?100:20;
   return `<div class="bar-wrap"><div class="bar-label"><span>${s}</span><span>${have?"Covered":"Gap"}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`
 }).join("");

 const existing=document.getElementById("projects").value.trim();
 document.getElementById("projectList").innerHTML=c.projects.map((p,i)=>`<div class="project"><b>${i+1}. ${p[0]}</b><p>${p[1]}</p></div>`).join("");

 const phases=[
 ["Foundation","Strengthen the prerequisites you are missing.",c.skills.slice(0,3)],
 ["Core Skills","Learn the central technical skills for "+c.name+".",c.skills.slice(3,6)],
 ["Applied Build","Turn knowledge into 2–3 portfolio projects.",c.skills.slice(6)],
 ["Industry Ready","Polish GitHub, documentation, testing, deployment and interview fundamentals.",["Resume","GitHub portfolio","System/interview practice"]]
 ];
 document.getElementById("roadmap").innerHTML=phases.map((p,i)=>`<div class="phase"><b>Phase ${i+1} · ${p[0]}</b><p>${p[1]}</p><ul>${p[2].map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("");

 const first= c.skills.filter(s=>!selected.has(s)).slice(0,3);
 document.getElementById("next30").innerHTML=[
 ["Week 1","Set up your learning environment, revise prerequisites and create a GitHub progress repo."],
 ["Week 2",`Start ${first[0]||c.skills[0]} with daily practice and one small exercise/project.`],
 ["Week 3–4",`Build a small ${c.projects[0][0]} prototype and publish a clear README${existing?"; connect it to your existing projects":""}.`]
 ].map(x=>`<div class="week"><b>${x[0]}</b><p>${x[1]}</p></div>`).join("");

 document.getElementById("dashboard").classList.remove("hidden");
 setTimeout(()=>document.getElementById("dashboard").scrollIntoView({behavior:"smooth"}),50);
}


let lastAIContext = {};
function setStatus(msg, busy=false){
  const el=document.getElementById('status');
  el.textContent=msg;
  el.className='status'+(busy?' busy':'');
}

function renderAI(data){
  document.getElementById('dashTitle').textContent=(data.career||'Career')+' Roadmap';
  document.getElementById('match').textContent=(data.matchPercent ?? 0)+'%';
  document.getElementById('coverage').textContent=(data.skills ? Math.round(data.skills.filter(s=>s.status==='covered').length/Math.max(1,data.skills.length)*100):0)+'%';
  document.getElementById('duration').textContent=data.duration||'12 mo';
  document.getElementById('dashSummary').textContent=data.summary||'';
  document.getElementById('skillBars').innerHTML=(data.skills||[]).map(s=>{
    const pct=s.status==='covered'?100:s.status==='partial'?60:20;
    return `<div class="bar-wrap"><div class="bar-label"><span>${escapeHtml(s.name)}</span><span>${escapeHtml(s.status)} · ${escapeHtml(s.priority||'')}</span></div><div class="bar"><i style="width:${pct}%"></i></div><div class="muted">${escapeHtml(s.reason||'')}</div></div>`;
  }).join('');
  document.getElementById('projectList').innerHTML=(data.projects||[]).map((p,i)=>`<div class="project"><b>${i+1}. ${escapeHtml(p.title)}</b><p>${escapeHtml(p.why||'')}<br><span class="muted">${(p.skills||[]).map(escapeHtml).join(' · ')} · ${escapeHtml(p.difficulty||'')}</span></p></div>`).join('');
  document.getElementById('roadmap').innerHTML=(data.roadmap||[]).map((p,i)=>`<div class="phase"><b>Phase ${i+1} · ${escapeHtml(p.phase)}</b><p>${escapeHtml(p.goal||'')} <span class="muted">(${escapeHtml(p.weeks||'')})</span></p><ul>${(p.skills||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}${(p.deliverables||[]).map(x=>`<li>Deliverable: ${escapeHtml(x)}</li>`).join('')}</ul></div>`).join('');
  document.getElementById('next30').innerHTML=(data.next30||[]).map(w=>`<div class="week"><b>${escapeHtml(w.week||'Week')}</b><p>${(w.tasks||[]).map(escapeHtml).join('<br>')}</p></div>`).join('');
  lastAIContext=data;
  document.getElementById('dashboard').classList.remove('hidden');
}
function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

async function generateRoadmap(){
  setStatus('Analyzing your profile with AI…',true);
  const username=document.getElementById('github').value.trim();
  let githubData=null;
  try{
    if(username){
      setStatus('Reading public GitHub profile…',true);
      const gr=await fetch('/api/github/'+encodeURIComponent(username));
      if(gr.ok) githubData=await gr.json();
    }
    const fd=new FormData();
    fd.append('education',document.getElementById('education').value);
    fd.append('year',document.getElementById('year').value);
    fd.append('career',document.getElementById('career').value);
    fd.append('hours',document.getElementById('hours').value);
    fd.append('skills',JSON.stringify([...selected]));
    fd.append('projects',document.getElementById('projects').value);
    fd.append('github',username);
    fd.append('githubData',JSON.stringify(githubData));
    const file=document.getElementById('resume').files[0];
    if(file) fd.append('resume',file);
    setStatus('Generating your personalized roadmap…',true);
    const r=await fetch('/api/analyze',{method:'POST',body:fd});
    const j=await r.json();
    if(!r.ok) throw new Error(j.error||'AI analysis failed');
    renderAI(j.data);
    setStatus('AI roadmap ready ✓');
    setTimeout(()=>document.getElementById('dashboard').scrollIntoView({behavior:'smooth'}),50);
  }catch(err){
    setStatus('AI unavailable ('+err.message+') — showing demo roadmap. Add an API key (Claude, Gemini or OpenAI) to .env to enable AI.');
    generateLocalRoadmap();
    document.getElementById('dashboard').scrollIntoView({behavior:'smooth'});
  }
}

async function sendChat(){
  const input=document.getElementById('chatInput'), msg=input.value.trim();
  if(!msg)return;
  const log=document.getElementById('chatLog');
  log.innerHTML+=`<div class="chat user">${escapeHtml(msg)}</div>`;
  input.value='';
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,context:lastAIContext})});
    const j=await r.json(); if(!r.ok) throw new Error(j.error||'Chat failed');
    log.innerHTML+=`<div class="chat bot">${escapeHtml(j.answer)}</div>`;
  }catch(e){log.innerHTML+=`<div class="chat bot">Mentor unavailable: ${escapeHtml(e.message)}. Add an API key (Claude, Gemini or OpenAI) in .env.</div>`}
  log.scrollTop=log.scrollHeight;
}
