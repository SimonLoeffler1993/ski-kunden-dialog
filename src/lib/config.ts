function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable "${name}" is missing`);
  }
  return value;
}

export const config = {
    // TODO: wen env existiert prüfen das am schluss kein slash ist
    backendUrl: getEnv('Backend_Url') || 'http://localhost:8000',
};