// ============================================================
// AJK Real Estate — Dashboard Charts
// assets/js/charts.js
// ============================================================

function renderCharts() {
  if (!State.properties.length) return;
  const typeCount={}, purposeCount={sale:0,rent:0}, cityCount={}, statusCount={Available:0,Sold:0,Rented:0,Reserved:0};
  State.properties.forEach(p => {
    typeCount[p.type]=(typeCount[p.type]||0)+1;
    p.purpose==='sale'?purposeCount.sale++:purposeCount.rent++;
    cityCount[p.city]=(cityCount[p.city]||0)+1;
    const s=p.status||'Available'; statusCount[s]=(statusCount[s]||0)+1;
  });
  const palette=['#5DCAA5','#C9A84C','#64B3F4','#FFAB76','#B39DDB','#81C784','#FF7675'];
  const dCfg=(labels,data,colors)=>({type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+ctx.raw}}}}});

  Object.keys(State.charts).forEach(k=>{ if(State.charts[k]){State.charts[k].destroy();State.charts[k]=null;} });

  const tL=Object.keys(typeCount),tD=Object.values(typeCount);
  State.charts.type=new Chart(document.getElementById('chart-type'),dCfg(tL,tD,palette));
  renderLegend('legend-type',tL,tD,palette);
  State.charts.purpose=new Chart(document.getElementById('chart-purpose'),dCfg(['For Sale','For Rent'],[purposeCount.sale,purposeCount.rent],['#5DCAA5','#64B3F4']));
  renderLegend('legend-purpose',['For Sale','For Rent'],[purposeCount.sale,purposeCount.rent],['#5DCAA5','#64B3F4']);
  const cL=Object.keys(cityCount).slice(0,7),cD=cL.map(c=>cityCount[c]);
  State.charts.city=new Chart(document.getElementById('chart-city'),{type:'bar',data:{labels:cL,datasets:[{data:cD,backgroundColor:'#1E8A65',borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#7A8C82',font:{size:11}},grid:{display:false}},y:{ticks:{color:'#7A8C82'},grid:{color:'#2A3830'}}}}});
  const sL=['Available','Sold','Rented','Reserved'],sD=sL.map(s=>statusCount[s]);
  State.charts.status=new Chart(document.getElementById('chart-status'),dCfg(sL,sD,['#5DCAA5','#FF7675','#64B3F4','#C9A84C']));
  renderLegend('legend-status',sL,sD,['#5DCAA5','#FF7675','#64B3F4','#C9A84C']);
}

function renderLegend(id,labels,data,colors) {
  document.getElementById(id).innerHTML=labels.map((l,i)=>`<div class="leg-item"><div class="leg-dot" style="background:${colors[i]}"></div>${l}: ${data[i]}</div>`).join('');
}
