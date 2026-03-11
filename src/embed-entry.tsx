import { createRoot } from 'react-dom/client';
import { EWICalculator } from '@/components/EWICalculator';
import { ShadowRootProvider } from '@/lib/shadow-root-context';
import embedCss from '@/index.css?inline';

function mountCalculator() {
  const host = document.getElementById('ewi-calculator');
  if (!host) {
    console.warn('[EWI Calculator] #ewi-calculator element not found.');
    return;
  }

  const shadow = host.attachShadow({ mode: 'open' });

  // Inject CSS into shadow DOM
  const style = document.createElement('style');
  style.textContent = embedCss;
  shadow.appendChild(style);

  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div');
  mountPoint.id = 'ewi-embed-root';
  shadow.appendChild(mountPoint);

  const root = createRoot(mountPoint);
  root.render(
    <ShadowRootProvider value={mountPoint}>
      <div className="bg-background text-foreground antialiased p-4">
        <EWICalculator />
      </div>
    </ShadowRootProvider>
  );
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountCalculator);
} else {
  mountCalculator();
}
