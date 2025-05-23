document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/machines')
        .then(response => response.json())
        .then(machines => {
            // Map backend status to frontend status
            machines.forEach(m => {
                if (m.status === 'online') m.status = 'Running';
                else if (m.status === 'offline') m.status = 'Stopped';
                else if (m.status === 'maintenance') m.status = 'Maintenance';
            });
            window.allMachines = machines;
            window.currentFilter = 'All';
            renderSummaryAndFilters(machines);
            renderMachineList(machines);
            renderAIInsights(machines); // Mock LLM insights
        })
        .catch(err => {
            console.error('Failed to load machines:', err);
        });
});

// Wrap dashboard in a dedicated section for modularity
// Add id="machine-dashboard" to the main dashboard section
// In index.html, change:
// <main class="dashboard"> ... </main>
// to:
// <main id="machine-dashboard" class="dashboard"> ... </main>
// No JS changes needed as all selectors already target elements inside the dashboard.

// Add summary and filter bar rendering
function renderSummaryAndFilters(machines) {
    const summaryBar = document.getElementById('summary-bar');
    if (!summaryBar) return;
    const total = machines.length;
    const running = machines.filter(m => m.status === 'Running').length;
    const stopped = machines.filter(m => m.status === 'Stopped').length;
    const maintenance = machines.filter(m => m.status === 'Maintenance').length;
    summaryBar.innerHTML = `
        <div class="summary">
            <span>Total: <strong>${total}</strong></span>
            <span>Running: <strong>${running}</strong></span>
            <span>Stopped: <strong>${stopped}</strong></span>
            <span>Maintenance: <strong>${maintenance}</strong></span>
        </div>
        <div class="filters">
            <button class="filter-btn" data-status="All">All</button>
            <button class="filter-btn" data-status="Running">Running</button>
            <button class="filter-btn" data-status="Stopped">Stopped</button>
            <button class="filter-btn" data-status="Maintenance">Maintenance</button>
        </div>
    `;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = function() {
            window.currentFilter = btn.getAttribute('data-status');
            renderMachineList(window.allMachines);
        };
    });
}

function isAbnormal(dp) {
    // Example: highlight if value is outside 10-90 (customize as needed)
    return typeof dp.value === 'number' && (dp.value < 10 || dp.value > 90);
}

function renderMachineList(machines) {
    const list = document.getElementById('machine-list');
    list.innerHTML = '';
    let filtered = machines;
    if (window.currentFilter && window.currentFilter !== 'All') {
        filtered = machines.filter(m => m.status === window.currentFilter);
    }
    filtered.forEach(machine => {
        const card = document.createElement('div');
        card.className = 'machine-card';
        card.innerHTML = `
            <div class="machine-card-header">
                <span class="machine-name">${machine.name}</span>
                <span class="machine-status ${machine.status.toLowerCase()}">${machine.status}</span>
            </div>
            <div class="machine-card-body">
                <div><strong>ID:</strong> ${machine.id}</div>
                <div><strong>Location:</strong> ${machine.location}</div>
                <div><strong>Last Updated:</strong> ${new Date(machine.lastUpdated).toLocaleString()}</div>
                <ul class="machine-datapoints">
                    ${machine.dataPoints.map(dp => `<li${isAbnormal(dp) ? ' class=\'abnormal\'' : ''}>${dp.label}: <span class="dp-value">${dp.value}</span> <span class="dp-unit">${dp.unit ?? ''}</span>${isAbnormal(dp) ? ' <span class=\'alert\'>!</span>' : ''}</li>`).join('')}
                </ul>
            </div>
            <button class="machine-details-btn">View Details</button>
        `;
        card.querySelector('.machine-details-btn').onclick = () => showMaintenanceModal(machine);
        list.appendChild(card);
    });
}

function showMaintenanceModal(machine) {
    const modal = document.getElementById('maintenance-modal');
    const details = document.getElementById('modal-machine-details');
    details.innerHTML = `
        <div class="modal-header">
            <span class="modal-title">${machine.name} (${machine.id})</span>
            <span class="modal-status ${machine.status.toLowerCase()}">${machine.status}</span>
        </div>
        <div class="modal-body">
            <div><strong>Location:</strong> ${machine.location}</div>
            <div><strong>Last Updated:</strong> ${new Date(machine.lastUpdated).toLocaleString()}</div>
            <ul class="machine-datapoints">
                ${machine.dataPoints.map(dp => `<li${isAbnormal(dp) ? ' class=\'abnormal\'' : ''}>${dp.label}: <span class="dp-value">${dp.value}</span> <span class="dp-unit">${dp.unit ?? ''}</span>${isAbnormal(dp) ? ' <span class=\'alert\'>!</span>' : ''}</li>`).join('')}
            </ul>
        </div>
        ${machine.status !== 'Running' ? '<button id="request-maintenance-btn">Request Maintenance</button>' : ''}
    `;
    // Render a chart for each data point
    const modalPredictiveContent = document.getElementById('modal-predictive-content');
    modalPredictiveContent.innerHTML = '';
    if (!window.maintenanceCharts) window.maintenanceCharts = [];
    // Destroy previous charts if any
    window.maintenanceCharts.forEach(chart => chart.destroy && chart.destroy());
    window.maintenanceCharts = [];
    machine.dataPoints.forEach((dp, idx) => {
        const chartId = `predictive-chart-${idx}`;
        const chartContainer = document.createElement('div');
        chartContainer.style.marginBottom = '24px';
        chartContainer.innerHTML = `<h4>${dp.label} (${dp.unit ?? ''})</h4><canvas id="${chartId}" width="400" height="200"></canvas>`;
        modalPredictiveContent.appendChild(chartContainer);
        // Generate mock time series data
        const labels = Array.from({length: 20}, (_, i) => `T-${20-i}`);
        const base = dp.value || 50;
        const data = Array.from({length: 20}, () => base + (Math.random() - 0.5) * 10);
        const ctx = document.getElementById(chartId).getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: dp.label,
                    data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { display: true },
                    title: { display: true, text: 'Time Series Analysis (Mocked)' }
                },
                scales: {
                    x: { title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: dp.unit || '' } }
                }
            }
        });
        window.maintenanceCharts.push(chart);
    });
    modal.style.display = 'block';
    if (machine.status !== 'Running') {
        const btn = document.getElementById('request-maintenance-btn');
        if (btn) {
            btn.onclick = function() {
                alert('Maintenance request sent for ' + machine.name);
            };
        }
    }
}

function renderAIInsights(machines) {
    const insightsDiv = document.getElementById('ai-insights');
    if (!insightsDiv) return;
    // Generate mock insights
    const total = machines.length;
    const maintenance = machines.filter(m => m.status === 'Maintenance').length;
    const stopped = machines.filter(m => m.status === 'Stopped').length;
    const running = machines.filter(m => m.status === 'Running').length;
    const abnormalCount = machines.reduce((sum, m) => sum + (m.dataPoints?.filter(dp => isAbnormal(dp)).length || 0), 0);
    const avgTemp = (() => {
        const temps = machines.flatMap(m => m.dataPoints?.filter(dp => /temp/i.test(dp.label)).map(dp => dp.value) || []);
        if (!temps.length) return null;
        return (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    })();
    const insights = [
        `LLM Insight: <strong>${maintenance}</strong> machine(s) require maintenance.`,
        `LLM Insight: <strong>${stopped}</strong> machine(s) are currently stopped.`,
        abnormalCount > 0 ? `LLM Insight: <strong>${abnormalCount}</strong> abnormal data point(s) detected.` : 'LLM Insight: All data points are within normal range.',
        avgTemp ? `LLM Insight: Average temperature across all machines is <strong>${avgTemp}°</strong>.` : ''
    ].filter(Boolean);
    insightsDiv.innerHTML = `
        <div class="ai-insights-header"><span>AI Insights (Mocked LLM)</span></div>
        <ul class="ai-insights-list">
            ${insights.map(i => `<li>${i}</li>`).join('')}
        </ul>
    `;
}

document.getElementById('modal-close').onclick = function() {
    document.getElementById('maintenance-modal').style.display = 'none';
};
window.onclick = function(event) {
    const modal = document.getElementById('maintenance-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
