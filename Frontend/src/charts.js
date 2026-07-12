// ============================================================
// TRANSITOPS — CHART ENGINE
// Lightweight SVG/Canvas chart rendering
// ============================================================

const Charts = {
  // ── Sparkline (inline mini chart) ──
  sparkline(container, data, options = {}) {
    const {
      width = 80, height = 32, color = '#6C5CE7',
      strokeWidth = 1.5, fill = true, animated = true
    } = options;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);

    const points = data.map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    const pathD = points.map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + step * 0.4;
      const cpx2 = p.x - step * 0.4;
      return `C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`;
    }).join(' ');

    const fillPath = pathD + ` L ${width} ${height} L 0 ${height} Z`;

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="sparkline-svg${animated ? ' sparkline-animated' : ''}">
        ${fill ? `<path d="${fillPath}" fill="url(#sparkGrad-${container.id || Math.random().toString(36).slice(2)})" opacity="0.3"/>` : ''}
        <defs>
          <linearGradient id="sparkGrad-${container.id || Math.random().toString(36).slice(2)}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" class="sparkline-path"/>
      </svg>
    `;
    container.innerHTML = svg;
  },

  // ── Radial Progress Ring ──
  radialProgress(container, value, options = {}) {
    const {
      size = 48, strokeWidth = 4, color = '#6C5CE7',
      trackColor = 'rgba(255,255,255,0.06)', showValue = true,
      fontSize = 11, animated = true
    } = options;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const center = size / 2;

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="radial-progress${animated ? ' radial-animated' : ''}">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${trackColor}" stroke-width="${strokeWidth}"/>
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${animated ? circumference : offset}"
          stroke-linecap="round" transform="rotate(-90 ${center} ${center})"
          class="radial-progress-circle" style="--target-offset: ${offset}; --circumference: ${circumference}"/>
        ${showValue ? `<text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="central"
          fill="var(--text-primary)" font-size="${fontSize}" font-weight="600" font-family="var(--font-primary)">${Math.round(value)}%</text>` : ''}
      </svg>
    `;
    container.innerHTML = svg;
  },

  // ── Area Chart ──
  areaChart(container, datasets, labels, options = {}) {
    const {
      width = 700, height = 280, paddingTop = 20, paddingBottom = 40,
      paddingLeft = 50, paddingRight = 20, gridLines = 5,
      animated = true, showTooltips = true, showDots = true
    } = options;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Find global min/max
    let allValues = [];
    datasets.forEach(ds => allValues.push(...ds.data));
    const max = Math.max(...allValues);
    const min = 0;
    const range = max - min || 1;
    const step = chartW / (labels.length - 1);

    // Grid & axis labels
    let gridSvg = '';
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingTop + (chartH / gridLines) * i;
      const val = max - (i / gridLines) * range;
      gridSvg += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>`;
      gridSvg += `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" fill="var(--chart-text)" font-size="11" font-family="var(--font-primary)">${Charts._formatNum(val)}</text>`;
    }

    // X-axis labels
    let xLabels = '';
    labels.forEach((label, i) => {
      const x = paddingLeft + i * step;
      xLabels += `<text x="${x}" y="${height - 8}" text-anchor="middle" fill="var(--chart-text)" font-size="11" font-family="var(--font-primary)">${label}</text>`;
    });

    // Dataset paths
    let dataSvg = '';
    datasets.forEach((ds, dsIdx) => {
      const points = ds.data.map((val, i) => ({
        x: paddingLeft + i * step,
        y: paddingTop + chartH - ((val - min) / range) * chartH
      }));

      const pathD = Charts._smoothPath(points);
      const gradId = `areaGrad-${dsIdx}-${Date.now()}`;
      const fillPath = pathD + ` L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

      dataSvg += `
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${ds.color}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${ds.color}" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="${fillPath}" fill="url(#${gradId})" class="${animated ? 'chart-area-fill' : ''}"/>
        <path d="${pathD}" fill="none" stroke="${ds.color}" stroke-width="2.5" stroke-linecap="round" class="chart-line ${animated ? 'chart-line-animated' : ''}" style="--line-length: 2000"/>
        <path d="${pathD}" fill="none" stroke="${ds.color}" stroke-width="6" stroke-linecap="round" opacity="0.15" filter="blur(4px)"/>
      `;

      if (showDots) {
        points.forEach((p, i) => {
          dataSvg += `
            <circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--bg-secondary)" stroke="${ds.color}" stroke-width="2" class="chart-dot" opacity="0">
              <title>${ds.label}: ${Charts._formatNum(ds.data[i])}</title>
            </circle>
          `;
        });
      }
    });

    // Legend
    let legendSvg = '';
    datasets.forEach((ds, i) => {
      const lx = paddingLeft + i * 140;
      legendSvg += `
        <circle cx="${lx}" cy="${height - 24}" r="4" fill="${ds.color}"/>
        <text x="${lx + 10}" y="${height - 20}" fill="var(--text-secondary)" font-size="11" font-family="var(--font-primary)">${ds.label}</text>
      `;
    });

    const svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" class="area-chart-svg">
        ${gridSvg}${xLabels}${dataSvg}${legendSvg}
      </svg>
    `;
    container.innerHTML = svg;
  },

  // ── Donut Chart ──
  donutChart(container, segments, options = {}) {
    const {
      size = 200, strokeWidth = 24, centerLabel = '',
      centerValue = '', animated = true, gap = 3
    } = options;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    let currentAngle = -90;
    let segmentsSvg = '';

    segments.forEach((seg, i) => {
      const pct = seg.value / total;
      const segLength = pct * circumference - gap;
      const gapOffset = circumference - segLength;

      segmentsSvg += `
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none"
          stroke="${seg.color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${segLength} ${gapOffset}"
          stroke-dashoffset="${animated ? circumference : 0}"
          stroke-linecap="round"
          transform="rotate(${currentAngle} ${center} ${center})"
          class="donut-segment${animated ? ' donut-animated' : ''}"
          style="--segment-delay: ${i * 100}ms; --target-dashoffset: 0">
          <title>${seg.label}: ${seg.value} (${(pct * 100).toFixed(1)}%)</title>
        </circle>
      `;
      currentAngle += pct * 360;
    });

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="donut-chart-svg">
        ${segmentsSvg}
        ${centerValue ? `<text x="${center}" y="${center - 6}" text-anchor="middle" fill="var(--text-primary)" font-size="24" font-weight="700" font-family="var(--font-primary)">${centerValue}</text>` : ''}
        ${centerLabel ? `<text x="${center}" y="${center + 14}" text-anchor="middle" fill="var(--text-tertiary)" font-size="11" font-weight="500" font-family="var(--font-primary)">${centerLabel}</text>` : ''}
      </svg>
    `;
    container.innerHTML = svg;

    // Legend below
    if (options.showLegend !== false) {
      const legend = document.createElement('div');
      legend.className = 'chart-legend';
      segments.forEach(seg => {
        const pct = ((seg.value / total) * 100).toFixed(1);
        legend.innerHTML += `
          <div class="chart-legend-item">
            <span class="chart-legend-dot" style="background:${seg.color}"></span>
            <span class="chart-legend-label">${seg.label}</span>
            <span class="chart-legend-value">${pct}%</span>
          </div>
        `;
      });
      container.appendChild(legend);
    }
  },

  // ── Horizontal Bar Chart ──
  barChart(container, data, options = {}) {
    const {
      height: barHeight = 28, gap = 8, showValues = true,
      animated = true, maxWidth = 300
    } = options;

    const max = Math.max(...data.map(d => d.value));
    let html = '<div class="bar-chart">';

    data.forEach((item, i) => {
      const pct = (item.value / max) * 100;
      html += `
        <div class="bar-chart-row" style="--delay: ${i * 60}ms">
          <div class="bar-chart-label">${item.label}</div>
          <div class="bar-chart-track">
            <div class="bar-chart-fill ${animated ? 'bar-animated' : ''}"
                 style="width: ${animated ? 0 : pct}%; --target-width: ${pct}%; background: ${item.color || 'var(--violet-gradient)'}; height: ${barHeight}px;">
            </div>
          </div>
          ${showValues ? `<div class="bar-chart-value">${Charts._formatNum(item.value)}</div>` : ''}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  },

  // ── Vertical Bar Chart (Mini) ──
  verticalBarChart(container, data, options = {}) {
    const {
      barWidth = 32, gap = 8, height = 120,
      animated = true, showLabels = true
    } = options;

    const max = Math.max(...data.map(d => d.value));
    let html = `<div class="vbar-chart" style="height:${height + 30}px">`;

    data.forEach((item, i) => {
      const pct = (item.value / max) * 100;
      const hasTarget = item.target !== undefined;
      const targetPct = hasTarget ? (item.target / max) * 100 : 0;

      html += `
        <div class="vbar-col" style="--delay: ${i * 60}ms">
          <div class="vbar-track" style="height:${height}px">
            ${hasTarget ? `<div class="vbar-target" style="bottom:${targetPct}%"></div>` : ''}
            <div class="vbar-fill ${animated ? 'vbar-animated' : ''}"
                 style="height:${animated ? 0 : pct}%; --target-height: ${pct}%;
                        background: ${item.value >= (item.target || 0) ? 'var(--violet-gradient)' : 'linear-gradient(to top, var(--amber-400), var(--amber-300))'}; width:${barWidth}px;">
            </div>
          </div>
          ${showLabels ? `<div class="vbar-label">${item.label}</div>` : ''}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  },

  // ── Helper: Smooth SVG path ──
  _smoothPath(points) {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const stepX = curr.x - prev.x;
      const cpx1 = prev.x + stepX * 0.4;
      const cpx2 = curr.x - stepX * 0.4;
      d += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`;
    }
    return d;
  },

  // ── Helper: Format number ──
  _formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toLocaleString();
  },

  // ── Animate charts on scroll (Intersection Observer) ──
  observeCharts() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('chart-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.chart-container').forEach(el => observer.observe(el));
  }
};
