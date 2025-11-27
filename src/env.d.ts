/** 声明VITE环境变量 */
interface ImportMetaEnv {
  VITE_DEEPSEEK_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}