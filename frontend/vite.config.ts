import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Precisamos disto para resolver o caminho absoluto

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      // Força a resolução de 'react' para a pasta node_modules deste projeto.
      // Isso resolve o problema de múltiplas instâncias de React (Invalid Hook Call).
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
});