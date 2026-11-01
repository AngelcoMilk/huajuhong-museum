import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 每个用例后卸载组件，避免 DOM 残留串味。
afterEach(() => {
  cleanup()
})
