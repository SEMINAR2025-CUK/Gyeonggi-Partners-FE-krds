import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Typography from './Typography'

describe('Typography', () => {
  it('기본적으로 올바른 태그로 출력된다', () => {
    render(<Typography variant="heading" size="large">Hello</Typography>)
    // heading의 defaultElement는 h2
    const elem = screen.getByText('Hello')
    expect(elem.tagName.toLowerCase()).toBe('h2')
  })

  it('as prop에 따라 태그가 변경된다', () => {
    render(<Typography variant="title" size="large" as="span">Test</Typography>)
    const elem = screen.getByText('Test')
    expect(elem.tagName.toLowerCase()).toBe('span')
  })

  it('유효하지 않은 size면 경고 뜨고, 첫 번째 사이즈로 처리된다', () => {
    // 콘솔 경고 스파이
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Typography variant="heading" size={"not-exist" as any} as="div">Error Size</Typography>)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('클래스네임이 올바르게 붙는다', () => {
    render(<Typography variant="body" size="medium" className="custom-class">Body Text</Typography>)
    const elem = screen.getByText('Body Text')
    expect(elem.className).toMatch(/text-body-medium/)
    expect(elem.className).toMatch(/font-regular/)
    expect(elem.className).toMatch(/custom-class/)
  })
})
