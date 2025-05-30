import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:5268/swagger/v1/swagger.json',
  output: 'src/generated/client',
  plugins: ['@hey-api/client-next'],
});
