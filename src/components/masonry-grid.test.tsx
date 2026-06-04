import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MasonryGrid } from '@/components/masonry-grid'

const mockItems = [
  { id: '1', content: <div>Item 1</div> },
  { id: '2', content: <div>Item 2</div> },
  { id: '3', content: <div>Item 3</div> },
  { id: '4', content: <div>Item 4</div> },
]

describe('MasonryGrid', () => {
  it('renders all items', () => {
    render(<MasonryGrid items={mockItems} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
  })

  it('renders with correct grid structure', () => {
    const { container } = render(<MasonryGrid items={mockItems} />)
    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveStyle({ columnCount: expect.any(String) })
  })

  it('renders empty state when no items', () => {
    render(<MasonryGrid items={[]} />)
    expect(screen.getByText(/no items/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<MasonryGrid items={mockItems} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with different column counts', () => {
    const { container: container2 } = render(<MasonryGrid items={mockItems} columns={2} />)
    const { container: container3 } = render(<MasonryGrid items={mockItems} columns={3} />)
    const { container: container4 } = render(<MasonryGrid items={mockItems} columns={4} />)
    
    expect(container2.firstChild).toHaveStyle({ columnCount: '2' })
    expect(container3.firstChild).toHaveStyle({ columnCount: '3' })
    expect(container4.firstChild).toHaveStyle({ columnCount: '4' })
  })

  it('uses responsive columns by default', () => {
    const { container } = render(<MasonryGrid items={mockItems} />)
    const grid = container.firstChild as HTMLElement
    // Should have responsive column class
    expect(grid.className).toContain('columns')
  })
})
